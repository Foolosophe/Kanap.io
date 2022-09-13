// Récupération de l'id dans l'URL
let string = window.location.href;
let url = new URL(string);
let idURL = url.searchParams.get("id");
console.log(idURL);

// Appel API avec l'id du produit
let productId = "";
let requestURL = "http://localhost:3000/api/products/" + idURL;
fetch(requestURL)
  .then((response) => response.json())
  .then(async function (resultAPI) {
    productId = await resultAPI;
    showProduct(productId);
  })
  .catch((error) => alert("Erreur : " + error));

// Affichage du produit
function showProduct(product) {
  document.title = product.name;
  let imgProduct = document.querySelector(".item__img"); 
  
  // Insertion de l'image du produit
  let imgProducts = document.createElement("img");
  imgProducts.setAttribute("src", product.imageUrl);
  imgProducts.setAttribute("alt", product.altTxt);
  imgProduct.appendChild(imgProducts); 
  
  // Insertion du nom du produit
  let titleProduct = document.querySelector("#title");
  titleProduct.textContent = product.name; 
  
  // Insertion du prix du produit
  let priceProduct = document.querySelector("#price");
  priceProduct.textContent = product.price; 
  
  // Insertion du choix du produit
  let descriptionProduct = document.querySelector("#description");
  descriptionProduct.textContent = product.description; 
  
  // Récupération de #colors
  let optionColors = document.querySelector("#colors"); 
  
  // Insertion du tableau des couleurs dans une variable
  let colors = product.colors; 
  
  // Insertion du choix de la couleur
  for (let i = 0; i < colors.length; i++) {
    let colorProduct = colors[i];
    let addOption = document.createElement("option");
    addOption.setAttribute("value", colorProduct);
    addOption.textContent = colorProduct;
    optionColors.appendChild(addOption);
  }
}

// Ajout au localstorage
let choiceColor = document.querySelector("#colors");
let choiceQuantity = document.querySelector("#quantity");
let sendToBasket = document.querySelector("#addToCart");

// Ecoute du click sur l'ajout au panier
sendToBasket.addEventListener("click", function (event) {

  // Récupération des valeurs de quantité et de la couleur du produit selectionné
  let valueColor = choiceColor.value;
  let valueQuantity = choiceQuantity.value;
  if (valueQuantity <= 0 || valueQuantity > 100 || valueColor == "") {
    alert(
      "Veuillez choisir une couleur et/ou une quantité comprise entre 1 et 100"
    );
  } 
  
  else {
    
    // Récupération du contenu du panier vide
    let basketStr = localStorage.getItem("basket");
    if (basketStr == null) {
      var basket = {
        totalQuantity: 0,
        products: [],
      };
    } 
    
    else {
      var basket = JSON.parse(basketStr);
    } 
    
    // Creation du produit choisi
    let choiceProduct = {
      id: productId._id,
      name: productId.name,
      color: valueColor,
      quantity: Number(valueQuantity),
      img: productId.imageUrl,
    }; 
    
    // Ajout des produits dans le panier (SI ils ont le même id et la même couleur)
    boolean = false;
    for (let i = 0; i < basket.products.length; i++) {
      basketProduct = basket.products[i];
      if (
        basketProduct.id == choiceProduct.id &&
        basketProduct.color == choiceProduct.color
      ) {
        newQuantity = basketProduct.quantity + choiceProduct.quantity;
        basketProduct.quantity = newQuantity;
        basket.totalQuantity = choiceProduct.quantity + basket.totalQuantity;
        boolean = true;
        break;
      }
    } 
    
    // Ajout des produits dans le panier (SI ils n'ont pas le même id ou pas la même couleur)
    if (boolean == false) {
      basket.products.push(choiceProduct);
      newQuantity = basket.totalQuantity + choiceProduct.quantity;
      basket.totalQuantity = newQuantity;
    }
    alert(
      "Votre commande de " +
        choiceProduct.quantity +
        " " +
        productId.name +
        " " +
        choiceProduct.color +
        " est bien ajoutée au panier !"
    );
    let lineBasket = JSON.stringify(basket);
    localStorage.setItem("basket", lineBasket);
    window.location.reload();
  }
});
