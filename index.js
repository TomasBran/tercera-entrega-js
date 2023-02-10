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
} else{
    localStorage.setItem("cardsData", JSON.stringify(new Array(datos.length).fill(0)));
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
let minusButtons = document.getElementsByClassName("minus-button");
let plusButtons = document.getElementsByClassName("plus-button");

function isInputEmpty(index){

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

        if(inputs[index].value < 0){
            Toastify({
                text: "No se pueden ingresar valores negativos",
                duration: 2000,
                close: true,
                gravity: "top",
                position: "center",
               
            }).showToast();
            inputs[index].value = 0;
            return true;
        }
    
            return inputs[index].value == 0;

}


// SECCION ADD TO CART // 


for (let index = 0; index < minusButtons.length; index++) {

    plusButtons[index].addEventListener("click", () =>{
        inputs[index].value = Number(inputs[index].value) + 1;

        Toastify({
            text: `Se añadió 1 copia de ${datos[index].name} al carro`,
            duration: 1200,
            close: true,
            gravity: "bottom",
            position: "right",
            style: {
                background: "linear-gradient(to right, #68c455, #1e830a)",
              },
        }).showToast();

        updateAmountBougth(inputs[index].value, index);
        
    });

    minusButtons[index].addEventListener("click", () => {
        

        if(inputs[index].value>0){

            Toastify({
                text: `Se quitó 1 copia de ${datos[index].name} del carro`,
                duration: 1200,
                close: true,
                gravity: "bottom",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #ca7070, #861717)",
                  },
                
            }).showToast();
        }


        inputs[index].value = Number(inputs[index].value) - 1;

        isInputEmpty(index);
        updateAmountBougth(inputs[index].value, index); 
        
    });

}

function updateAmountBougth(input, index){
    datos[index].amountBought = input;
                
    localStorage.setItem("cardsData", JSON.stringify(numberOfCardsBought()));
    updateMoneyOnCart();
}


function updateMoneyOnCart(){

    localStorage.setItem("totalMoney", 0);
    let temporaryMoney = 0;

    const data = JSON.parse(localStorage.getItem("cardsData"));
    data.forEach((element, index) => {
        temporaryMoney += element * Number(datos[index].price);
    });

    localStorage.setItem("totalMoney", Number(localStorage.getItem("totalMoney")) + Number(temporaryMoney));
    
    moneyDisplay.innerText = Number(localStorage.getItem("totalMoney")).toFixed(2);
    disableBuyIfEmptyCart();
}

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
            } else{
                Swal.fire("No se vació el carro", "", "info");
            }
            emptyCartText.innerText = "";
        })
    } else{
        Swal.fire("El carrito ya está vacío.", "", "info");
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
        inputs[index].value = 0;   
    }
    localStorage.setItem("cardsData" , JSON.stringify(cardsDataClear));
    localStorage.setItem("totalMoney", 0);
    disableBuyIfEmptyCart();
    
    updateMoneyOnCart();
}

Array.from(document.getElementsByClassName("single-card-empty")).forEach((element, index) => {
    
    element.addEventListener("click", () => {
        emptySingleCard(index);
        
    });

})


function emptySingleCard(cardIndex){
    
    if(document.getElementsByClassName("card-amount")[cardIndex].value != 0){

        Swal.fire({
            title: `Desea eliminar ${datos[cardIndex].amountBought} copias de ${datos[cardIndex].name} del carrito?`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Confirmar",
            denyButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed){
                Swal.fire(`Has eliminado las copias de ${datos[cardIndex].name} del carrito`, "", "success");
    
                updateAmountBougth(0 , cardIndex);
                localStorage.setItem("cardsData", JSON.stringify(numberOfCardsBought()));
                disableBuyIfEmptyCart();
                updateMoneyOnCart();
                document.getElementsByClassName("card-amount")[cardIndex].value = 0;
    
            } else{
                Swal.fire("No se han eliminado las cartas", "", "warning");
            }
        });
    } else{
        Swal.fire(`No hay ninguna copia de ${datos[cardIndex].name} en el carrito`, "", "warning");
    }



    
    
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


// SECCION FILTRO // 

function filterCards(rarity){
    
    Array.from(document.getElementsByClassName("card-item")).forEach(element => {
        
        if(rarity == "all"){
            element.style.display = "flex";
            return;
        }

        if(!element.classList.contains(rarity)){
            element.style.display = "none";
        }else{
            element.style.display = "flex";
        }
    });

}

let raritySelect = document.getElementsByName("rarity-filter")[0];

raritySelect.addEventListener("change", () => {
    filterCards(raritySelect.value);
})


// FIN SECCION FILTRO //




// SECCION RENDER CARD // 
function renderCard(title, imageSource, price, rarity){
    let cardsGrid = document.getElementById("cards-container");

    let cardContainer = document.createElement("div");
    let cardTitle = document.createElement("h4");
    let cardImage = document.createElement("img");
    let cardPrice = document.createElement("p");

    let amountDivContainer = document.createElement("div");

    let amountInput = document.createElement("input");
    let cardAmountText = document.createElement("p");
    let minusButton = document.createElement("button");
    let plusButton = document.createElement("button");

    let cardToCartButton = document.createElement("button");

    cardsGrid.appendChild(cardContainer);

    cardContainer.setAttribute("class", `card-item ${rarity}`);
    
    cardTitle.innerText = title;
    cardTitle.setAttribute("class", "card-title");

    cardImage.setAttribute("src", imageSource);
    cardImage.setAttribute("class", "card");
    
    cardPrice.innerText = "Precio: $" + price;

    amountDivContainer.setAttribute("class","amount-div-container");

    cardAmountText.innerHTML = "<span>Cantidad: &nbsp</span>";
    minusButton.innerText = "-";
    plusButton.innerText = "+";

    minusButton.setAttribute("class", "minus-button");
    plusButton.setAttribute("class", "plus-button");


    
    amountInput.setAttribute("maxlength", 2);
    amountInput.setAttribute("value", 0);
    amountInput.setAttribute("class", "card-amount");
    amountInput.setAttribute("disabled", "true");

    cardToCartButton.innerText = "Vaciar";
    cardToCartButton.setAttribute("class", "single-card-empty");

    

    cardContainer.appendChild(cardTitle);
    cardContainer.appendChild(cardImage);
    cardContainer.appendChild(cardPrice);
    cardContainer.appendChild(amountDivContainer);
    amountDivContainer.appendChild(cardAmountText);
    amountDivContainer.appendChild(minusButton);
    amountDivContainer.appendChild(amountInput);
    amountDivContainer.appendChild(plusButton);
    cardContainer.appendChild(cardToCartButton);



}

function renderAllCards(list){
    
    list.forEach(card => {
       
        renderCard(card.name, card.imageText, card.price.toFixed(2), card.rarity)

    });

}
// FIN SECCION RENDER CARD //
