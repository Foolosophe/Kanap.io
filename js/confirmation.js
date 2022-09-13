//Récupération du numéro de commande dans l'URL
let str = window.location.href;
let url = new URL(str);
let idOrderURL = url.searchParams.get("orderId");

//Affichage du numéro de commande
let orderIdNumberElt = document.querySelector('#orderId');
orderIdNumberElt.innerHTML = idOrderURL;

