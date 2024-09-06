const tuorGrid = document.getElementById("tuor-grid")
const cartModal = document.getElementById("cart-modal")
const cartBtn = document.getElementById("cart-btn")
const cartTotal =document.getElementById("cart-total")
const checkoutBtn = document.getElementById("check-out-btn")
const closeModalBtn = document.getElementById("close-modal-btn")

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

//Open cart modal
cartBtn.addEventListener("click", function() {
    cartModal.style.display = "flex";
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
