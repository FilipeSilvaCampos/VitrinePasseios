const tuorGrid = document.getElementById("tuor-grid")
const cartModal = document.getElementById("cart-modal")
const cartBtn = document.getElementById("cart-btn")
const cartTotal =document.getElementById("cart-total")
const checkoutBtn = document.getElementById("check-out-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const fixedTop = document.getElementById('fixed-top')
const cartBoxItems = document.getElementById('cart-items')

fetch("./src/data.json").then((response) => {
    response.json().then((data) => {
        let gridRow = '<div class="row">';
        for(let i = 0; i < data.servicos.length; i++) {            
            gridRow += `<div class="col-md-3 p-2">
                            ${createTuorCard(data.servicos[i], i)}
                        </div>`;
            if(i/4 == 1) {
                gridRow += "</div>"
                tuorGrid.innerHTML += gridRow;
                gridRow = '<div class="row">';
            }
        }
        document.querySelectorAll(".card").forEach((card) => {
            card.addEventListener("click", function() {
                window.open(`./service.html?service=${card.getAttribute('data-serviceIndex')}`, "_self")
            })       
        })
    });
})

window.onscroll = function() {
    stickyScroll();
}

//Open cart modal
document.querySelectorAll(".cart-button").forEach((element) => {
    element.addEventListener('click', function () {
      cartModal.style.display = 'flex'
    })
  })

//Close cart modal
cartModal.addEventListener("click", function(event) {
    if(event.target == cartModal){
        cartModal.style.display = "none";
    }
})

closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none";
})

// Isert cart itens
initCart();

function createTuorCard(service, id) {
    return `<div class="card" style="border-radius: 20px; min-height: 21rem;"
            data-serviceIndex="${id}">
                            <img src="${service.cardImg}" class="card-img-ov"></img>
                            <div class="card-body">
                                <h5 class="card-title fw-bold">${service.name}</h5>
                                ${createAtractiveElements(service.atractives)}
                                <div class="card-footer-ov">
                                    <span>Pré-Reserva</span>
                                    <span class="fs-3 fw-bold price-text">${service.preBooking.toLocaleString(undefined, {style: 'currency', currency: 'BRL'})}</span>
                                </div>
                            </div>
                        </div>`
}

function createAtractiveElements(atractiveList) {
    let element = '<div class="card-atractive">';
    for(let i =0; i < 3; i++) {
        element += `<div>
                        <i class="bi ${atractiveList[i].iconClass}"></i>
                        <span>${atractiveList[i].title}</span>
                    </div>`
    }
    return element + "</div>";
}

function initCart() {
    const userCart = JSON.parse(localStorage.getItem('userCart')) ?? []

    userCart.forEach((element) => {
       cartBoxItems.innerHTML += `<div class="cart-item">
                                                <hr>
                                                <p class="fw-bold txt-secondary mb-0 fs-6 ps-2">${element.name}:</p>
                                                <div class="d-flex flex-row justify-content-between ps-5 txt-subtitle">
                                                    <span>${element.adultQtd}x Adulto</span>
                                                    <span>${ToMoneyFormat(element.adultValue)}</span>
                                                </div>
                                                <div class="d-flex flex-row justify-content-between ps-5 txt-subtitle">
                                                    <span>${element.kidQtd}x Adulto</span>
                                                    <span>${ToMoneyFormat(element.kidValue)}</span>
                                                </div>
                                                <hr>
                                            </div>`
    })
}

function stickyScroll() {
    if(window.scrollY < fixedTop.offsetHeight)
    {
        fixedTop.classList.add('invisible');
    } else{
        fixedTop.classList.remove('invisible');
    }
}

//Support functions
function ToMoneyFormat(string) {
    return string.toLocaleString(undefined, {style: 'currency', currency: 'BRL'})
  }
