//Appel API de tous les produits
let allItems = "";
let requestURL = "http://localhost:3000/api/products/";
fetch(requestURL)
  .then((response) => response.json())
  .then(async function (resultAPI) {
    allItems = await resultAPI;
    showCouchs(allItems);
  })
  .catch((error) => alert("Erreur : " + error));

// Affichage de tout les produits
function showCouchs(allProducts) {
  for (let i = 0; i < allProducts.length; i++) {
    let product = allProducts[i];
    let allPanels = document.querySelector(".items"); 
    
    // Insertion des liens de chaque produits
    let productLink = document.createElement("a");
    productLink.setAttribute("href", "./product.html?id=" + product._id);
    allPanels.appendChild(productLink); // Insertion des articles

    let productDisplay = document.createElement("article");
    productLink.appendChild(productDisplay); 
    
    // Insertion des images
    let imgProducts = document.createElement("img");
    imgProducts.setAttribute("src", product.imageUrl);
    imgProducts.setAttribute("alt", product.altTxt);
    productDisplay.appendChild(imgProducts); 
    
    // Insertion des noms
    let productTitle = document.createElement("h3");
    productTitle.className = "productName";
    productTitle.textContent = product.name;
    productDisplay.appendChild(productTitle); 
    
    // Insertion des descriptions
    let descriptionProducts = document.createElement("p");
    descriptionProducts.className = "productDescription";
    descriptionProducts.textContent = product.description;
    productDisplay.appendChild(descriptionProducts);
  }
  console.table(allProducts);
}
