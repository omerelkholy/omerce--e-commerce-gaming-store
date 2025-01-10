let carticon = document.querySelector('.cart-icon')
let body = document.querySelector('body')
let closebtn = document.querySelector('.close')
let gaminglist = document.querySelector('.gamelist')
let mycart = document.querySelector('.listcart')
let mycount = document.getElementById('cart')
carticon.addEventListener('click', ()=>{body.classList.toggle('showcart')})
closebtn.addEventListener('click', ()=>{body.classList.toggle('showcart')})
let gamelist = []
let cartlist = []

const addtoHtml = ()=>{
    gaminglist.innerHTML='';
        gamelist.forEach(game =>{
            let newgame = document.createElement('div')
            newgame.classList.add('col')
            newgame.innerHTML= `<div class="card border-none h-100 w-100">
                        <img src="${game.image}" class="card-img-top" alt="${game.name}">
                        <div class="card-body" data-id="${game.id}" >
                            <h2>${game.name}</h2>
                            <p class="mt-5">$${game.price}</p>
                            <button class="addtocart">Add to Cart <i class="fa-solid fa-bag-shopping"></i></button>
                        </div>
                        <div class="card-footer">
                            <small class="text-body-secondary">${game.lastupdated}</small>
                        </div>
                        </div>`
            gaminglist.appendChild(newgame);
        })
}
gaminglist.addEventListener('click', (action) =>{
    let cartclick = action.target;
    if(cartclick.classList.contains('addtocart')){
        let game_id = cartclick.parentElement.dataset.id;
        addtocart(game_id);
    }
})






let addtocart = (id) => {
    let check = false;
    let item = {
        id: id,
        quantity: 1
    }
    for (i = 0; i < cartlist.length; i++) {
        if (cartlist[i].id == id) {
            cartlist[i].quantity++
            check = true;
        }
    }
    if (check == false) {
        cartlist.push(item);
    }
    addCartToHtml();
    addtomemory();
}


function addtomemory(){
    localStorage.setItem('cart', JSON.stringify(cartlist))
}


function addCartToHtml() {
    mycart.innerHTML = "";
    let counter = 0
    cartlist.forEach(game => {
        counter = counter + game.quantity
        let indexOfGame = gamelist.findIndex((value) => value.id == game.id)
        let info = gamelist[indexOfGame]
        let newitem = document.createElement('div');
        newitem.classList.add('item')
        newitem.dataset.id = game.id
        newitem.innerHTML = `<div class="game-image">
                    <img src="${info.image}" alt="">
                </div>
                <div class="name">
                    ${info.name}
                        </div>
                <div class="price">
                    $${info.price * game.quantity}
                </div>
                <div class="quantity">
                            <span class="decrease">-</span>
                            <span>${game.quantity}</span>
                            <span class="increase">+</span>
                </div>`;


        mycart.appendChild(newitem);


    })

    mycount.innerText = counter
}

mycart.addEventListener('click', action =>{
    let change = action.target
    if(change.classList.contains('decrease') || change.classList.contains('increase')){
        let gameid = change.parentElement.parentElement.dataset.id
        let type = 'decrease'
        if(change.classList.contains('increase')){
            type = 'increase'
        }

        changeQuantity(gameid, type);
    }
})

function changeQuantity(gameid, type){
    let indexOfGame = cartlist.findIndex((value) => value.id == gameid)
    if(indexOfGame>=0){
        switch (type) {
            case 'increase':
                cartlist[indexOfGame].quantity= cartlist[indexOfGame].quantity + 1
                break;
        
            default:
                let valuechange = cartlist[indexOfGame].quantity= cartlist[indexOfGame].quantity - 1
                if(valuechange > 0){
                    cartlist[indexOfGame].quantity = valuechange
                }else {
                    cartlist.splice(indexOfGame, 1)
                }
                break;
        }
    }
    addtomemory();
    addCartToHtml();
}


const retrieve = () => {
    fetch('games.json')
    .then(response => response.json())
    .then(data=>{
        gamelist = data;
        addtoHtml();

        if(localStorage.getItem('cart')){
            cartlist = JSON.parse(localStorage.getItem('cart'));
            addCartToHtml();
        }

    })
}

retrieve();