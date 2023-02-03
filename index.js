import myJson from './cards.json' assert {type: 'json'}

let moneyDisplay = document.getElementById("total");
let itemList = document.getElementById("item-list");

localStorage.setItem("totalMoney" , Number(localStorage.getItem("totalMoney")).toFixed(2));


let datos;

const get_data = async () => {
    const response = await fetch('./cards.json');
    let data = await response.json();

    renderAllCards(data);

    return data;
    
}

datos = await get_data();



let firstTimeExecute;

if(localStorage.getItem("cardsData") == undefined){
    firstTimeExecute = true;
}else{
    firstTimeExecute = false;
}

if (!firstTimeExecute){
    for (let index = 0; index < datos.length; index++) {
        datos[index].amountBought = JSON.parse(localStorage.getItem("cardsData"))[index];
    }
}



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

let inputs = document.getElementsByClassName("card-amount");

function allInputsAreEmpty(){

    for (let index = 0; index < inputs.length; index++) {
        if (isNaN(inputs[index].value)){
            
            Toastify({
                text: "Solo se pueden ingresar números",
                duration: 2000,
                close: true,
                gravity: "top",
                position: "center",
               

            }).showToast();
            
            inputs[index].value = 0;
            return true;
        }
    }

    for (let index = 0; index < inputs.length; index++) {
        if (inputs[index].value != 0)
            return false;
    }

    return true;


}

for (let index = 0; index < inputs.length; index++) {
    inputs[index].addEventListener("change", () => {
        addToCartButton.disabled = allInputsAreEmpty();
    });
}







// SECCION ADD TO CART // 

function updateMoneyOnCart(){
    moneyDisplay.innerText = Number(localStorage.getItem("totalMoney")).toFixed(2);
}

let addToCartButton = document.getElementById("addToCartButton");

const temporaryAmount = [];

let temporaryMoney = 0;

function addToCart(){
    for (let index = 0; index < datos.length; index++) {
        
        let input = document.getElementsByClassName("card-amount")[index];

        temporaryAmount[index] = Number(input.value);

        addCardsToItemList(input, index);

        temporaryMoney = Number(localStorage.getItem("totalMoney"));
        temporaryMoney += input.value * datos[index].price;
        localStorage.setItem("totalMoney" , temporaryMoney);
        
        input.value = 0;
    }
    
}

function addCardsToItemList(amount, index){
    if (amount.value != 0){

        if(amount.value == 1){
            itemList.innerHTML +=`
            ${amount.value} copia de ${datos[index].name}.`
        }else{
            itemList.innerHTML +=`
            ${amount.value} copias de ${datos[index].name}.`
        }

    }
}

let initialItemListText = "Desea agregar los siguientes items a la lista?:";

function clearItemListAdder(){
    itemList.innerHTML = initialItemListText;
}

addToCartButton.addEventListener("click", () => {
    addToCart();
    if(itemList.innerText!=initialItemListText){
        Swal.fire({
            title: `${itemList.innerHTML}`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Agregar",
            denyButtonText: "No agregar",
        }).then((result) => {
            if (result.isConfirmed){
                Swal.fire("Items añadidos a la lista.", "", "success");
                updateMoneyOnCart();
                for (let index = 0; index < datos.length; index++) {
                    datos[index].amountBought += Number(temporaryAmount[index]);
                    temporaryAmount[index]=0;            
                }
                
                localStorage.setItem("cardsData", JSON.stringify(numberOfCardsBought()));
                emptyCartButton.style.display = "block";
            } else{
                Swal.fire("Items no añadidos.", "", "error");
                localStorage.setItem("totalMoney" , Number(moneyDisplay.innerText));
            }
            disableBuyIfEmptyCart();
            clearItemListAdder();
        })
    }
})

function numberOfCardsBought(){
    let amountBoughtArray = [];
    for (let index = 0; index < datos.length; index++) {
        amountBoughtArray[index] = Number(datos[index].amountBought);
    }
    return amountBoughtArray;
}
// FIN SECCION ADD TO CART //




// SECCION EMPTY CART // 
let emptyCartButton = document.getElementById("empty-cart-button");

if(localStorage.getItem("totalMoney")!=0){
    emptyCartButton.style.display = "block";
}

emptyCartButton.addEventListener("click", () => {
    
    if(localStorage.getItem("totalMoney") != 0){
        updateEmptyCartText();
        Swal.fire({
            title: `${emptyCartText.innerHTML}`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Vaciar",
            denyButtonText: "No vaciar",
        }).then((result) => {
            if (result.isConfirmed){
                Swal.fire("Carrito vacío.", "", "success");
                emptyCart();
                emptyCartButton.style.display = "none";
            } else{
                Swal.fire("No se vació el carro", "", "info");
            }
            emptyCartText.innerText = "";
        })
    }
});

let emptyCartText = document.getElementById("empty-item-list");

function updateEmptyCartText(){
    emptyCartText.innerHTML = "Desea eliminar los siguientes items del carrito?:"
    for (let index = 0; index < datos.length; index++) {
        if(datos[index].amountBought!=0){

            if(datos[index].amountBought == 1){
                emptyCartText.innerHTML +=`
                ${datos[index].amountBought} copia de ${datos[index].name}`
            }
            else{
                emptyCartText.innerHTML +=`
                ${datos[index].amountBought} copias de ${datos[index].name}`
            }


        }
    }
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

// FIN SECCION EMPTY CART // 





// SECCION BUY //


// Esta funcion es para que cuando llegue al menu de comprar, tire un color de mana aleatorio. Ya es lujo //
function randomManaIcon(){
    switch(Math.floor(Math.random() * 5)){
        case 0:
            return "<img src='./images/blue-mana.png'>";
        case 1:
            return "<img src='./images/red-mana.png'>";
        case 2:
            return "<img src='./images/green-mana.png'>";
        case 3:
            return "<img src='./images/white-mana.png'>";
        case 4:
            return "<img src='./images/black-mana.png'>";
        default:
            alert("Error");
            break;
    }
}


let buyListText = document.getElementById("buy-list");
let buyButton = document.getElementById("buy-button");

buyButton.addEventListener("click", () =>{
    addCardsToBuyList();
    Swal.fire({
        title: `${buyListText.innerHTML}`,
        iconHtml: randomManaIcon(),
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Comprar",
        denyButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed){
            Swal.fire("Has comprado las cartas por US$" + Number(localStorage.getItem("totalMoney")).toFixed(2), "Gracias por tu compra", "success");
            emptyCart();
            emptyCartButton.style.display = "none";
        } else{
            Swal.fire("No se ha confirmado la compra de las cartas", "Volverás al menu anterior", "warning");
        }
    })
    
})

function addCardsToBuyList(){
    buyListText.innerHTML=`Confirmar compra de las siguientes cartas:
    `

    let amountBoughtArray = JSON.parse(localStorage.getItem("cardsData"));
    for (let index = 0; index < amountBoughtArray.length; index++) {

        if(amountBoughtArray[index]!=0){

            if(amountBoughtArray[index]==1){
                buyListText.innerHTML+=`${amountBoughtArray[index]} copia de ${datos[index].name} a $${datos[index].price.toFixed(2)} c/u 
                `
            } else{
                buyListText.innerHTML+=`${amountBoughtArray[index]} copias de ${datos[index].name} a $${datos[index].price.toFixed(2)} c/u 
                `
            }
        }
    }

    document.getElementById("buy-list").innerHTML+=`<br>Total: US$${Number(localStorage.getItem("totalMoney")).toFixed(2)}`

}
// FIN SECCION BUY//


// SECCION RENDER CARD // 
function renderCard(title, imageSource, price){
    let cardsGrid = document.getElementById("cards-container");

    let cardContainer = document.createElement("div");
    let cardTitle = document.createElement("h4");
    let cardImage = document.createElement("img");
    let cardPrice = document.createElement("p");

    let amountDivContainer = document.createElement("div");

    let amountInput = document.createElement("input");
    let cardAmountText = document.createElement("p");

    cardsGrid.appendChild(cardContainer);

    cardContainer.setAttribute("class", "card-item");
    
    cardTitle.innerText = title;
    cardTitle.setAttribute("class", "card-title");

    cardImage.setAttribute("src", imageSource);
    cardImage.setAttribute("class", "card");
    
    cardPrice.innerText = "Precio: $" + price;

    amountDivContainer.setAttribute("class","amount-div-container");

    cardAmountText.innerHTML = "<span>Cantidad: &nbsp</span>";


    
    amountInput.setAttribute("maxlength", 2);
    amountInput.setAttribute("value", 0);
    amountInput.setAttribute("class", "card-amount");

    

    cardContainer.appendChild(cardTitle);
    cardContainer.appendChild(cardImage);
    cardContainer.appendChild(cardPrice);
    cardContainer.appendChild(amountDivContainer);
    amountDivContainer.appendChild(cardAmountText);
    amountDivContainer.appendChild(amountInput);



}

function renderAllCards(list){
    
    list.forEach(card => {
       
        renderCard(card.name, card.imageText, card.price.toFixed(2))

    });

}
// FIN SECCION RENDER CARD //
