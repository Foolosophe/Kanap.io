// Récupération du contenu du panier à partir du localstorage
let basketStr = localStorage.getItem("basket");
let basket = JSON.parse(basketStr);

// Récupération de l'élement "cart__items"
let cartPanel = document.querySelector("#cart__items");

// Affichage des produits dans la page panier (avec les prix en fetch)
function showProductBasket(produit) {
    
  // Insertion des articles
  let productDisplay = document.createElement("article");
  productDisplay.className = "cart__item";
  productDisplay.setAttribute("data-id", produit.id);
  productDisplay.setAttribute("data-color", produit.color);
  cartPanel.appendChild(productDisplay); 
  
  // Insertion div de l'img
  let divImg = document.createElement("div");
  divImg.className = "cart__item__img";
  productDisplay.appendChild(divImg); 
  
  // Insertion des images
  let imgProducts = document.createElement("img");
  imgProducts.setAttribute("src", produit.img);
  imgProducts.setAttribute("alt", "Photographie d'un canapé");
  divImg.appendChild(imgProducts); 
  
  // Insertion de la div "descriptif du contenu"
  let DivContDes = document.createElement("div");
  DivContDes.className = "cart__item__content";
  productDisplay.appendChild(DivContDes); 
  
  // Insertion de la div description
  let divDescription = document.createElement("div");
  divDescription.className = "cart__item__content__description";
  DivContDes.appendChild(divDescription); 
  
  // Insertion du nom du produit
  let createH2 = document.createElement("h2");
  createH2.textContent = produit.name;
  divDescription.appendChild(createH2); 
  
  // Insertion du choix de la couleur
  let createpColor = document.createElement("p");
  createpColor.textContent = "Couleur : " + produit.color;
  divDescription.appendChild(createpColor); 
  
  // Recupération du prix en utilisant l'id du produit
  let productId = "";
  fetch("http://localhost:3000/api/products/" + produit.id)
    .then((response) => response.json())
    .then(async function (resultAPI) {
      productId = await resultAPI; 
      
      // Insertion du prix
      let createpPrice = document.createElement("p");
      createpPrice.textContent = "Prix : " + productId.price + " € / canapé";
      divDescription.appendChild(createpPrice);
    })
    .catch((error) => alert("Erreur : " + error)); 
    
    // Insertion de la div "paramètres du contenu"
  let DivContSet = document.createElement("div");
  DivContSet.className = "cart__item__content__settings";
  DivContDes.appendChild(DivContSet); 
  
  // Insertion de la div "paramètre de la quantité"
  let DivContSetQuantity = document.createElement("div");
  DivContSetQuantity.className = "cart__item__content__settings__quantity";
  DivContSet.appendChild(DivContSetQuantity); 
  
  // Insertion de la quantité
  let quantityProducts = document.createElement("p");
  quantityProducts.textContent = "Qté :";
  DivContSetQuantity.appendChild(quantityProducts);
  let inputQuantity = document.createElement("input");
  inputQuantity.className = "itemQuantity";
  inputQuantity.setAttribute("type", "number");
  inputQuantity.setAttribute("name", "itemQuantity");
  inputQuantity.setAttribute("min", "0");
  inputQuantity.setAttribute("max", "100");
  inputQuantity.setAttribute("value", produit.quantity);
  DivContSetQuantity.appendChild(inputQuantity); 
  
  // Insertion de la div supprimer
  let DivContSetDel = document.createElement("div");
  DivContSetDel.className = "cart__item__content__settings__delete";
  DivContSet.appendChild(DivContSetDel); 
  
  // Insertion du texte supprimer
  let removeProducts = document.createElement("p");
  removeProducts.className = "deleteItem";
  removeProducts.textContent = "Supprimer";
  DivContSetDel.appendChild(removeProducts);
}

// Récupération de produit dans l'API via son id
async function getProduct(id) {
  return fetch("http://localhost:3000/api/products/" + id)
    .then((response) => response.json())
    .catch((error) => alert("Erreur : " + error));
}

// Si le panier est vide, afficher "panier vide"
// Sinon afficher le panier, et utiliser la function showproductbasket
async function showCart() {
  if (basketStr == null) {
    let createpEmpty = document.createElement("p");
    createpEmpty.textContent = "Votre panier est vide";
    cartPanel.appendChild(createpEmpty);
  } else {
    let totalPrice = 0;
    for (let i = 0; i < basket.products.length; i++) {
      basketProduct = basket.products[i];
      showProductBasket(basketProduct);
      let productsPrice = await getProduct(basketProduct.id);
      let productQuantity = basketProduct.quantity;
      totalPrice += productsPrice.price * productQuantity;
      let totalPriceElt = document.querySelector("#totalPrice");
      totalPriceElt.textContent = totalPrice;
    }
    let totalQuantity = document.querySelector("#totalQuantity");
    totalQuantity.textContent = basket.totalQuantity;
    console.log(basket.totalQuantity);
    console.log(totalPrice);
    changeQuantity();
    delProduct();
  }
}
showCart();

// Changement de la quantité et du prix
function changeQuantity() {
  let quantityItem = document.querySelectorAll(".itemQuantity");
  for (let k = 0; k < quantityItem.length; k++) {
    quantityItemUnit = quantityItem[k];
    quantityItemUnit.addEventListener("change", function (event) {
      for (let l = 0; l < basket.products.length; l++) {
        basketProduct = basket.products[l];
        let articleQuantityItemID = event.target
          .closest("article")
          .getAttribute("data-id");
        let articleQuantityItemColor = event.target
          .closest("article")
          .getAttribute("data-color");
        newQuantityValue = event.target.valueAsNumber;
        if (
          basketProduct.id == articleQuantityItemID &&
          basketProduct.color == articleQuantityItemColor
        ) {
          qtyToAdd = newQuantityValue - basketProduct.quantity;
          basketProduct.quantity = newQuantityValue;
          basket.totalQuantity = basket.totalQuantity + qtyToAdd;
          let lineBasket = JSON.stringify(basket);
          localStorage.setItem("basket", lineBasket);
          window.location.reload();
        }
      }
    });
  }
}

// Suppression d'un produit
function delProduct() {
  let delItem = document.querySelectorAll(".deleteItem");
  for (let j = 0; j < delItem.length; j++) {
    delItemUnit = delItem[j];
    delItemUnit.addEventListener("click", function (event) {
      let articleDelItemID = event.target
        .closest("article")
        .getAttribute("data-id");
      let articleDelItemColor = event.target
        .closest("article")
        .getAttribute("data-color");
      let basket = JSON.parse(basketStr);
      productToDel = basket.products.find(
        (el) => el.id == articleDelItemID && el.color == articleDelItemColor
      );
      result = basket.products.filter(
        (el) => el.id !== articleDelItemID || el.color !== articleDelItemColor
      );
      basket.products = result;
      newQuantity = basket.totalQuantity - productToDel.quantity;
      basket.totalQuantity = newQuantity;
      priceToDel = productToDel.quantity * productToDel.price;
      alert("Vous avez bien supprimé votre produit du panier !");
      if (basket.totalQuantity == 0) {
        localStorage.clear();
        window.location.reload();
      } else {
        let lineBasket = JSON.stringify(basket);
        localStorage.setItem("basket", lineBasket);
        window.location.reload();
      }
    });
  }
}

// Validation formulaire
let form = document.querySelector(".cart__order__form");

// REGEX
let adressRegExp = new RegExp("^[A-zÀ-ú0-9 ,.'-]+$");
let nameRegExp = new RegExp("^[A-zÀ-ú -]+$");
let emailRegExp = new RegExp("^[a-zA-Z0-9_. -]+@[a-zA-Z.-]+[.]{1}[a-z]{2,10}$");

let firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
form.firstName.addEventListener("change", function (e) {
  let value = e.target.value;
  if (nameRegExp.test(value)) {
    firstNameErrorMsg.innerHTML = "";
  } else {
    firstNameErrorMsg.innerHTML =
      "Champ invalide, veuillez vérifier votre prénom.";
  }
});

let lastNameErrorMsg = form.lastName.nextElementSibling;
form.lastName.addEventListener("change", function (e) {
  let value = e.target.value;
  if (nameRegExp.test(value)) {
    lastNameErrorMsg.innerHTML = "";
  } else {
    lastNameErrorMsg.innerHTML = "Champ invalide, veuillez vérifier votre nom.";
  }
});

let adressErrorMsg = document.querySelector("#addressErrorMsg");
form.address.addEventListener("change", function (e) {
  let value = e.target.value;
  if (adressRegExp.test(value)) {
    adressErrorMsg.innerHTML = "";
  } else {
    adressErrorMsg.innerHTML =
      "Champ invalide, veuillez vérifier votre adresse postale.";
  }
});

let cityErrorMsg = document.querySelector("#cityErrorMsg");
form.city.addEventListener("change", function (e) {
  let value = e.target.value;
  if (nameRegExp.test(value)) {
    cityErrorMsg.innerHTML = "";
  } else {
    cityErrorMsg.innerHTML = "Champ invalide, veuillez vérifier votre ville.";
  }
});

let emailErrorMsg = document.querySelector("#emailErrorMsg");
form.email.addEventListener("change", function (e) {
  let value = e.target.value;
  if (emailRegExp.test(value)) {
    emailErrorMsg.innerHTML = "";
  } else {
    emailErrorMsg.innerHTML =
      "Champ invalide, veuillez vérifier votre adresse email.";
  }
});

// Passer la commande
let btnOrder = document.querySelector("#order");

btnOrder.addEventListener("click", function (e) {
  e.preventDefault();
  let inputFirstName = document.getElementById("firstName");
  let inputLastName = document.getElementById("lastName");
  let inputAddress = document.getElementById("address");
  let inputCity = document.getElementById("city");
  let inputEmail = document.getElementById("email");
  if (basketStr == null) {
    alert("Pour passer commande, veuillez ajouter des produits à votre panier");
    e.preventDefault();
  } else if (
    firstName.value === "" ||
    lastName.value === "" ||
    address.value === "" ||
    city.value === "" ||
    email.value === ""
  ) {
    alert("Vous devez renseigner vos coordonnées pour passer la commande !");
    e.preventDefault();
  } else if (
    nameRegExp.test(inputFirstName.value) == false ||
    nameRegExp.test(inputLastName.value) == false ||
    adressRegExp.test(inputAddress.value) == false ||
    nameRegExp.test(inputCity.value) == false ||
    emailRegExp.test(inputEmail.value) == false
  ) {
    alert("Vérifiez vos coordonnées pour passer la commande !");
    e.preventDefault();
  } else {
    productID = [];
    for (let m = 0; m < basket.products.length; m++) {
      productID.push(basket.products[m].id);
    }
    let order = {
      contact: {
        firstName: inputFirstName.value,
        lastName: inputLastName.value,
        address: inputAddress.value,
        city: inputCity.value,
        email: inputEmail.value,
      },
      products: productID,
    };
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify(order),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async function (resultOrder) {
        order = await resultOrder;
        document.location.href = "confirmation.html?orderId=" + order.orderId;
        localStorage.clear();
      });
  }
});
