//Init local storage
let produitLocalStorage = JSON.parse (localStorage.getItem("produit"));
const positionEmptyCart = document.querySelector("#cart__items");

let totalPrice = 0;

function getCart()
{

//Si panier vide, afficher le message "panier vide"
if (produitLocalStorage === null || produitLocalStorage == 0) 
{
    const emptyCart = `<p>Votre panier est vide !</p>`;
    positionEmptyCart.innerHTML = emptyCart;
    alert ("veuillez ajouter un produit au panier")
    return
}
else 
{
//Si 1 ou + articles dans panier, on intègre les différents éléments dans le panier
for (let produit in produitLocalStorage)
{
    fetch("http://localhost:3000/api/products/" + produitLocalStorage[produit].idProduit)
    .then ((response) => response.json())
    .then (product =>{

        produitLocalStorage[produit].prixProduit =product.price
        produitLocalStorage [produit].imgProduit = product.imageUrl
        produitLocalStorage [produit].altImgProduit = product.altTxt
        produitLocalStorage [produit].nomProduit = product.name
        totalPrice += product.price*produitLocalStorage[produit].quantiteProduit

 // Recupération du prix total

if (produit == (produitLocalStorage.length -1)) 
{ //On recupere la valeur du prix de la dernière ligne
 document.getElementById ("totalPrice").innerHTML = totalPrice

}
 //Insertion de article et de ses attributs

let productArticle = document.createElement("article");
 document.querySelector("#cart__items").appendChild(productArticle);
 productArticle.className = "cart__item";
 productArticle.setAttribute('data-id', produitLocalStorage[produit].idProduit);
 productArticle.setAttribute('data-color', produitLocalStorage[produit].couleurProduit);

// Insertion de "div"
let productDivImg = document.createElement("div");
productArticle.appendChild(productDivImg);
productDivImg.className = "cart__item__img";

// Insertion de l'image
let productImg = document.createElement("img");
productDivImg.appendChild(productImg);
productImg.src = produitLocalStorage[produit].imgProduit;
productImg.alt = produitLocalStorage[produit].altImgProduit;

// Insertion des "div"
let productItemContent = document.createElement("div");
productArticle.appendChild(productItemContent);
productItemContent.className = "cart__item__content";

let productItemContentTitlePrice = document.createElement("div");
productItemContent.appendChild(productItemContentTitlePrice);
productItemContentTitlePrice.className = "cart__item__content__titlePrice";

// Insertion du titre
let productTitle = document.createElement("h2");
productItemContentTitlePrice.appendChild(productTitle);
productTitle.innerHTML = produitLocalStorage[produit].nomProduit;

// Insertion de la couleur
let productColor = document.createElement("p");
productTitle.appendChild(productColor);
productColor.innerHTML = produitLocalStorage[produit].couleurProduit;

// Insertion du prix
let productPrice = document.createElement("p");
productItemContentTitlePrice.appendChild(productPrice);
productPrice.innerHTML = produitLocalStorage[produit].prixProduit + " €";

// Insertion des "div"
let productItemContentSettings = document.createElement("div");
productItemContent.appendChild(productItemContentSettings);
productItemContentSettings.className = "cart__item__content__settings";

let productItemContentSettingsQuantity = document.createElement("div");
productItemContentSettings.appendChild(productItemContentSettingsQuantity);
productItemContentSettingsQuantity.className = "cart__item__content__settings__quantity";

// Insertion de p "Quantité : "
let productQte = document.createElement("p");
productItemContentSettingsQuantity.appendChild(productQte);
productQte.innerHTML = "Quantité : ";

if (productQte.value <=0 )
 {
    alert ("Veuillez insérer un nombre supérieur à 0");
    return  
 }
 else if (productQte.value >100)
 {
    alert ("Veuillez insérer un nombre inférieur à 100");
    return
 };

 // Insertion des attributs de quantité
 let productQuantity = document.createElement("input");
 productItemContentSettingsQuantity.appendChild(productQuantity);
 productQuantity.value = produitLocalStorage[produit].quantiteProduit;
 productQuantity.className = "itemQuantity";
 productQuantity.setAttribute("type", "number");
 productQuantity.setAttribute("min", "1");
 productQuantity.setAttribute("max", "100");
 productQuantity.setAttribute("name", "itemQuantity");

 // Insertion de "div"
 let productItemContentSettingsDelete = document.createElement("div");
 productItemContentSettings.appendChild(productItemContentSettingsDelete);
 productItemContentSettingsDelete.className = "cart__item__content__settings__delete";

 // Insertion  supprimer
 let productSupprimer = document.createElement("p");
 productItemContentSettingsDelete.appendChild(productSupprimer);
 productSupprimer.className = "deleteItem";
 productSupprimer.innerHTML = "Supprimer";

deleteProduct();
changeQtt();
      }
     )
   }
}}
getCart();

// Total des quantités

function getTotalsQtt() 
{
 
 let quantityTotal = 0;

 for (let i = 0; i < produitLocalStorage.length; i++) 
{
    quantityTotal += produitLocalStorage[i].quantiteProduit;
}

let productTotalQuantity = document.getElementById("totalQuantity");
productTotalQuantity.innerHTML = quantityTotal;

}
getTotalsQtt();

// Pour supprimer un article panier

function deleteProduct() 
{
let btn_supprimer = document.querySelectorAll(".deleteItem");

//On observe le click de suppression d'un article

 for (let j = 0; j < btn_supprimer.length; j++)
    {
        btn_supprimer[j].addEventListener("click" , (event) => 
        {
            event.preventDefault();

//Selection de l'element à supprimer en fonction de son id ET sa couleur
                let idSuppr = btn_supprimer[j].closest("article").dataset.id;
                let colorSuppr = btn_supprimer[j].closest("article").dataset.color;

                produitLocalStorage = produitLocalStorage.filter( el => el.idProduit !== idSuppr || el.couleurProduit !== colorSuppr );
                
                localStorage.setItem("produit", JSON.stringify(produitLocalStorage));

//Quand localStorage vide, le panier est vide
                if (produitLocalStorage.length === 0) 
                {
                    localStorage.clear();

                }
                //
                window.location.reload()
        })
    }
}
// Pour modifier les quantités du panier

    function changeQtt() 
    {
      let quantitySelector = document.querySelectorAll (".itemQuantity");
      
// On observe le changement de quantité

for (let k = 0; k< quantitySelector.length;k++)
{
  quantitySelector[k].addEventListener("change", (event) =>
  {
      event.preventDefault();
      
      if (event.target.value <=0 )
{
    alert ("Veuillez insérer un nombre supérieur à 0");
    return  
}
else if (event.target.value >100)
{
    alert ("Veuillez insérer un nombre inférieur à 100");
    return
};
      
            // On se positionne et cible l'element que l'on veut supprimer
              let idSuppr = quantitySelector[k].closest("article").dataset.id;
              let colorSuppr = quantitySelector[k].closest("article").dataset.color;

              produitLocalStorage = produitLocalStorage.map (el =>
              {
                if (el.idProduit === idSuppr && el.couleurProduit === colorSuppr)
                {
                    return {
                        ...el,
                        quantiteProduit:parseInt(event.target.value)
                    }
                }else
                {
                    return el
                } 
            })
              localStorage.setItem("produit", JSON.stringify(produitLocalStorage));
              window.location.reload()
          })

          
}


}

    // On construit un formulaire avec des fonctions régulières (regex)
   
   let validNameRegExp = new RegExp ("^[a-zA-Z ,.'-]+$");
   let emailRegExp = new RegExp ("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$");
   let addressRegExp = new RegExp ("^([0-9]*) ?([a-zA-Z,\. ]*)$");

   function formuGet() 
   {

    let form = document.querySelector (".cart__order__form");

    //On écoute les modifs du formulaire

    form.firstName.addEventListener('change',function() 
    {
        validFirstName(this);
    });

    form.lastName.addEventListener('change', function () 
    {
        validLastName(this);
    });

    form.address.addEventListener('change', function () 
    {
        validAddress(this);
    });

    form.city.addEventListener('change', function () 
    {
        validCity(this);
    });

    form.email.addEventListener('change', function () 
    {
        validEmail(this);
    });

//On controle les entrées du formulaire


const validFirstName = function(inputFirstName)
{

    let firstNameErrorMsg = inputFirstName.nextElementSibling;

    if (validNameRegExp.test(inputFirstName.value)){
        firstNameErrorMsg.innerHTML = '';
    }   else 
    {
        firstNameErrorMsg.innerHTML = "Saisie invalide.Veuillez réessayer."
    }
};

const validLastName = function (inputLastName) 
{
    let lastNameErrorMsg = inputLastName.nextElementSibling;

    if (validNameRegExp.test(inputLastName.value)) 
    {
        lastNameErrorMsg.innerHTML = '';
    } else 
    {
        lastNameErrorMsg.innerHTML = 'Saisie invalide.Veuillez réessayer.';
    }
};

const validAddress = function (inputAddress) 
{
    let addressErrorMsg = inputAddress.nextElementSibling;

    if (addressRegExp.test(inputAddress.value)) 
    {
        addressErrorMsg.innerHTML = '';
    } else 
    {
        addressErrorMsg.innerHTML = 'Saisie invalide.Veuillez réessayer.';
    }
};

const validCity = function (inputCity) {
    let cityErrorMsg = inputCity.nextElementSibling;

    if (validNameRegExp.test(inputCity.value)) 
    {
        cityErrorMsg.innerHTML = '';
    } else 
    {
        cityErrorMsg.innerHTML = 'Saisie invalide.Veuillez réessayer.';
    }
};

const validEmail = function (inputEmail) 
{
    let emailErrorMsg = inputEmail.nextElementSibling;

    if (emailRegExp.test(inputEmail.value)) 
    {
        emailErrorMsg.innerHTML = '';
    } else 
    {
        emailErrorMsg.innerHTML = 'Saisie invalide.Veuillez réessayer.';
    }
};
}

formuGet();

//On envoie le formulaire au localstorage une fois que les entrées sont vérifiées

function formuSend() 
{

const order =document.getElementById ('order');
      order.addEventListener('click',(event) => 
{
            event.preventDefault();

//On récupère les infos client
let inputName = document.getElementById('firstName');
let inputLastName = document.getElementById('lastName');
let inputAddress = document.getElementById('address');
let inputCity = document.getElementById('city');
let inputMail = document.getElementById('email');

//On construit un array du LS et on vérifie les informations avant le passage de la commande

if (
    firstName.value === "" ||
    lastName.value === "" ||
    address.value === "" ||
    city.value === "" ||
    email.value === ""
  ) {
    alert("Vous devez renseigner vos coordonnées pour passer la commande !");
  }
   else {
let products = [];
for (let i = 0; i<produitLocalStorage.length;i++) 
{
    products.push(produitLocalStorage[i].idProduit);
}
const order = 
{
    contact : 
    {
        firstName: inputName.value,
        lastName: inputLastName.value,
        address: inputAddress.value,
        city: inputCity.value,
        email: inputMail.value,
    },
    products: products,
} 
//On envoie les infos (contact+products) au serveur
const options = 
{
    method: 'POST',
    body: JSON.stringify(order),
    headers: 
    { 
                "Content-Type": "application/json" 
            },
        };

 //Et ensuite on redirige l'utilisateur vers la page confirmation

 fetch("http://localhost:3000/api/products/order", options)
  .then((response) => response.json())
  .then((data) => 
 {
    localStorage.clear();
    document.location.href = "confirmation.html?orderId=" + data.orderId;
})
}
}
)
}
formuSend();