import myJson from './cards.json' assert {type: 'json'}


let moneyDisplay = document.getElementById("total");
let itemList = document.getElementById("item-list");

localStorage.setItem("totalMoney" , Number(localStorage.getItem("totalMoney")).toFixed(2));

disableBuyIfEmptyCart();

function disableBuyIfEmptyCart(){
    if(localStorage.getItem("totalMoney") != 0){
        document.getElementById("buy-button").disabled = false;
    }
    else{
        document.getElementById("buy-button").disabled = true;
    }
}

moneyDisplay.innerText = Number(localStorage.getItem("totalMoney"));

localStorage.setItem("cardsData", localStorage.getItem("cardsData"));

console.log(JSON.parse(localStorage.getItem("cardsData")));

localStorage.setItem("cardsData", JSON.parse(localStorage.getItem("cardsData")));




let datos;

const get_data = async () => {
    const response = await fetch('./cards.json');
    let data = await response.json();

    renderAllCards(data);

    return data;
    
    // FUNCION OPCIONAL (leer abajo de todo) //
    // for (let index = 0; index < data.length; index++) {
    //    renderWithBackticks(data[index].name, data[index].        imageText, data[index].price);
    // }

}

datos = await get_data();



function numberOfCardsBought(){
    let amountBoughtArray = [];
    for (let index = 0; index < datos.length; index++) {
        amountBoughtArray[index] = Number(datos[index].amountBought);
    }
    return amountBoughtArray;
}

let selects = document.getElementsByClassName("card-amount");



function allSelectsAreEmpty(){
    for (let index = 0; index < selects.length; index++) {
        if(selects[index].value !=0)
        return false;
    }
    return true;
}

for (let index = 0; index < selects.length; index++) {
    selects[index].addEventListener("change", () => {
        addToCartButton.disabled = allSelectsAreEmpty();
    });
}

const temporaryAmount = [];
let temporaryMoney = 0;
function addToCart(){
    
    for (let index = 0; index < datos.length; index++) {
        
        let select = document.getElementsByClassName("card-amount")[index];

        temporaryAmount[index] = Number(select.value);

        addCardsToItemList(select, index);

        temporaryMoney = Number(localStorage.getItem("totalMoney"));
        temporaryMoney += select.value * datos[index].price;
        localStorage.setItem("totalMoney" , temporaryMoney);
        
        select.value = 0;
    }
    
}

let buyModal = document.getElementById("buyModal");

let yesChoiceBuy = document.getElementsByClassName("yes-choice")[2];
let noChoiceBuy = document.getElementsByClassName("no-choice")[2];

yesChoiceBuy.addEventListener("click" , confirmBuy);
noChoiceBuy.addEventListener("click" , () => {
    exitModal(buyModal)
})


document.getElementById("buy-button").addEventListener("click", () =>{
    addCardsToBuyList();
    showModal(buyModal);
})


function addCardsToBuyList(){
    document.getElementById("buy-list").innerHTML=`Confirmar compra de las siguientes cartas:<br>
    `

    let amountBoughtArray = JSON.parse(localStorage.getItem("cardsData"));
    for (let index = 0; index < amountBoughtArray.length; index++) {

        if(amountBoughtArray[index]!=0){

            
            document.getElementById("buy-list").innerHTML+=`
            ${amountBoughtArray[index]} copias de ${datos[index].name} a $${datos[index].price.toFixed(2)} c/u<br> 
            `
        }
    }

    document.getElementById("buy-list").innerHTML+=`<br>Total: US$${Number(localStorage.getItem("totalMoney")).toFixed(2)}`

}

function confirmBuy(){

    


}




let emptyCartModal = document.getElementById("emptyCartModal");

let yesChoiceEmptyCart = document.getElementsByClassName("yes-choice")[1];
let noChoiceEmptyCart = document.getElementsByClassName("no-choice")[1];

yesChoiceEmptyCart.addEventListener("click", () => confirmEmptyCart(true));
noChoiceEmptyCart.addEventListener("click",() => confirmEmptyCart(false));



let emptyCartButton = document.getElementById("empty-cart-button");

if(localStorage.getItem("totalMoney")!=0){
    emptyCartButton.style.display = "block";
}

emptyCartButton.addEventListener("click", () => {
    
    if(localStorage.getItem("totalMoney") != 0){
        updateEmptyCartModal();
        showModal(emptyCartModal);
    }
});

let emptyCartText = document.getElementById("empty-item-list");

function updateEmptyCartModal(){
    emptyCartText.innerHTML = "Desea eliminar los siguientes items del carrito?:<br>"
    for (let index = 0; index < datos.length; index++) {
        if(datos[index].amountBought!=0){

            emptyCartText.innerHTML +=`
            ${datos[index].amountBought} copias de ${datos[index].name} <br>            
            `
        }
    }
}



function confirmEmptyCart(boolChoice){
    if(boolChoice){
        emptyCart();
        emptyCartButton.style.display = "none";
    }
    emptyCartText.innerText = "";
    exitModal(emptyCartModal);
}

function emptyCart(){
    let cardsDataClear = [];
    for (let index = 0; index < datos.length; index++) {
        datos[index].amountBought = 0;
        cardsDataClear[index] = 0;   
    }
    localStorage.setItem("cardsData" , JSON.stringify(cardsDataClear));
    localStorage.setItem("totalMoney", 0);
    disableBuyIfEmptyCart();
    
    updateMoneyOnCart();
}



let yesChoiceAddToCart = document.getElementsByClassName("yes-choice")[0];
let noChoiceAddToCart = document.getElementsByClassName("no-choice")[0];

yesChoiceAddToCart.addEventListener("click" , () => confirmAddToCart(true));
noChoiceAddToCart.addEventListener("click" , () => confirmAddToCart(false));


function updateMoneyOnCart(){
    moneyDisplay.innerText = Number(localStorage.getItem("totalMoney")).toFixed(2);
}

function confirmAddToCart(boolChoice){
    
    if (boolChoice){
        updateMoneyOnCart();
        for (let index = 0; index < datos.length; index++) {
            datos[index].amountBought += Number(temporaryAmount[index]);
            temporaryAmount[index]=0;            
        }
        
        // for (let index = 0; index < datos.length; index++) {
        //     localStorage.setItem("cardsData")[index]
        // }

        localStorage.setItem("cardsData", JSON.stringify(numberOfCardsBought()));
        emptyCartButton.style.display = "block";
        

    } else{
        localStorage.setItem("totalMoney" , Number(moneyDisplay.innerText));

    }
    
    disableBuyIfEmptyCart();
    clearItemListAdder();
    exitModal(addToCartModal);
}

function clearItemListAdder(){
    itemList.innerHTML = "Desea agregar los siguientes items a la lista?:";
}

function addCardsToItemList(amount, index){
    if (amount.value != 0){

        itemList.innerHTML +=`
        <br> ${amount.value} copias de ${datos[index].name}.
        `
    }
}

let addToCartButton = document.getElementById("addToCartButton");
addToCartButton.addEventListener("click", () => {
    addToCart();
    addToCartButton.disabled = allSelectsAreEmpty();
    
}
);


let addToCartModal = document.getElementById("addToCartModal");


let initialItemListText = "Desea agregar los siguientes items a la lista?:";

addToCartButton.addEventListener("click", () => {
    if(itemList.innerText!=initialItemListText){
        showModal(addToCartModal);
    }
})



window.onclick = function (event){
    if(event.target.className == "modal"){
        confirmAddToCart(false);
        confirmEmptyCart(false);
    }
}


function showModal(modalType){
    modalType.style.display = "block";
}

function exitModal(modalType){
    modalType.style.display = "none";
}



function renderCard(title, imageSource, price){
    let cardsGrid = document.getElementById("cards-container");

    let cardContainer = document.createElement("div");
    let cardTitle = document.createElement("h4");
    let cardImage = document.createElement("img");
    let cardPrice = document.createElement("p");

    let amountDivContainer = document.createElement("div");

    let cardAmountText = document.createElement("p");
    let amountSelect = document.createElement("select");

    cardsGrid.appendChild(cardContainer);

    cardContainer.setAttribute("class", "card-item");
    
    cardTitle.innerText = title;
    cardTitle.setAttribute("class", "card-title");

    cardImage.setAttribute("src", imageSource);
    cardImage.setAttribute("class", "card");
    
    cardPrice.innerText = "Precio: $" + price;

    amountDivContainer.setAttribute("class","amount-div-container");

    cardAmountText.innerHTML = "<span>Cantidad: &nbsp</span>";

    amountSelect.innerHTML = `
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
    `
    amountSelect.setAttribute("class", "card-amount");
    

    cardContainer.appendChild(cardTitle);
    cardContainer.appendChild(cardImage);
    cardContainer.appendChild(cardPrice);
    cardContainer.appendChild(amountDivContainer);
    amountDivContainer.appendChild(cardAmountText);
    amountDivContainer.appendChild(amountSelect);


}

function renderAllCards(list){
    
    list.forEach(card => {
       
        renderCard(card.name, card.imageText, card.price.toFixed(2))

    });

}

// FUNCION OPCIONAL, EN VEZ DE ESTA, SE UTILIZA renderCard()// 
function renderWithBackticks(title, imageSource, price){
    
    let cardsGrid = document.getElementById("cards-container");
    
    
    cardsGrid.innerHTML+=    
    `
    <div class="card-item"><h4>${title}</h4><img src=${imageSource} class="card"><p>Precio: $${price}</p><div class="amount-div-container"><p><span>Cantidad: &nbsp;</span></p><select class="card-amount">
    <option value="0">0</option>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
    </select></div></div>
    
    `;
}
