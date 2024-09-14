const state = {
    views: {
        adultQtd: document.getElementById("adult-qtd"),
        kidQtd: document.getElementById('kid-qtd'),
        subTotal: document.getElementById('subtotal'),
        totalPessoas: document.getElementById('total-pessoas'),
        priceCard: document.getElementById('priceCard'),
        fixedTop: document.getElementById('fixed-top'),
        reserveBtn: document.getElementById('reserve-button'),
        cartBoxItems: document.getElementById('cart-items'),
        cartModal: document.getElementById('cart-modal'),
        cartTotal: document.getElementById('cart-total'),
        checkoutBtn: document.getElementById('check-out-btn')
    },

    values: {
        adultQtd: 0,
        cartTotal: 0,
        kidQtd: 0,
        subTotal: 0,
        userCart: []
    }
}

const urlParams = new URLSearchParams(window.location.search,);
let service;

fetch("./src/data.json").then((response) => {
    response.json().then((data) => {
         service = data.servicos[urlParams.get('service')];

         state.values.userCart = JSON.parse(localStorage.getItem('userCart')) ?? [];
         initButtons();
         initViews();
    });
})

window.onscroll = function () {
  stickyScroll();
}


  //Functions
  function initButtons() {

    document.querySelectorAll(".cart-button").forEach((element) => {
      element.addEventListener('click', function () {
        state.views.cartModal.style.display = 'flex'
      })
    })

    document.getElementById('close-modal-btn').addEventListener('click', function() {
      state.views.cartModal.style.display = 'none'
    })

    document.querySelectorAll(".bi-dash").forEach((element) => {
        element.addEventListener("click", function() {
            const ref = element.getAttribute('data-reference');
            state.values[ref]--;
            state.values[ref] = getMaxValue(state.values[ref], 0);
            state.views[ref].innerHTML = state.values[ref];
            calcAmount();
        })
    })

    document.querySelectorAll(".bi-plus-lg").forEach((element) => {
        element.addEventListener("click", function() {
            const ref = element.getAttribute('data-reference');
            state.values[ref]++;
            state.views[ref].innerHTML = state.values[ref];
            calcAmount();
        })
    })

    state.views.cartModal.addEventListener("click", function(event) {
      if(event.target == state.views.cartModal){
          state.views.cartModal.style.display = "none";
      }
    })

    state.views.reserveBtn.addEventListener('click', function () {
      const wantedService = {
        "name": service.name,
        "adultValue" : service.value,
        "kidValue": service.kidValue,
        "adultQtd" : state.values.adultQtd,
        "kidQtd": state.values.kidQtd,
        "total": state.values.subTotal
      }
    
      state.values.userCart.push(wantedService);
      localStorage.setItem('userCart', JSON.stringify(state.values.userCart));
      drawCartItems();
      state.views.cartModal.style.display = 'flex';
    })
  }

  function initViews() {
    document.getElementById('adult-value').innerHTML = ToMoneyFormat(service.value);
    document.getElementById('kid-value').innerHTML = ToMoneyFormat(service.kidValue);

    initCarousel();
    drawCartItems();
    suplyInfo();
  }

  function drawCartItems() {
    state.views.cartBoxItems.innerHTML = '';
    let i = 0;
    state.values.cartTotal = 0;
    state.values.userCart.forEach((element) => {
        state.views.cartBoxItems.innerHTML += `<div class="cart-item">
                                                <hr>
                                                <div class="d-flex flex-row justify-content-between align-items-center">
                                                    <p class="fw-bold txt-secondary mb-0 fs-6 ps-2">${element.name}:</p>
                                                    <i class="bi bi-x fs-4 text-danger cart-item-remover"
                                                       data-elementIndex="${i}">
                                                    </i>
                                                </div>
                                                <div class="d-flex flex-row justify-content-between ps-5 txt-subtitle">
                                                    <span>${element.adultQtd}x Adulto</span>
                                                    <span>${ToMoneyFormat(element.adultValue)}</span>
                                                </div>
                                                <div class="d-flex flex-row justify-content-between ps-5 txt-subtitle">
                                                    <span>${element.kidQtd}x Adulto</span>
                                                    <span>${ToMoneyFormat(element.kidValue)}</span>
                                                </div>
                                                <div class="w-100 d-flex justify-content-end mt-2">
                                                    <span>Total: ${ToMoneyFormat(element.total)}</span>
                                                </div>
                                                <hr>
                                            </div>`
        i++;
        state.values.cartTotal += element.total;
    })

    state.views.cartTotal.innerHTML = ToMoneyFormat(state.values.cartTotal);
    addCartItemBehavior();

    state.views.checkoutBtn.addEventListener("click", function() {
      if(state.values.userCart.length == 0) return;
  
      const cartItems = state.values.userCart.map((item) => {
          return (
              `${item.name} para ${item.adultQtd} adultos e ${item.kidQtd} crianças, Total: ${ToMoneyFormat(item.total)} |`
          )
      }).join("");
  
      const message = encodeURIComponent(`Olá Mateus gostaria de mais informações acerca desta cotação: ` + cartItems);
      const phone = "7399528587";
  
      window.open(`https://wa.me/${phone}?text=${message}`)
  })
}

function addCartItemBehavior() {
    document.querySelectorAll('.cart-item-remover').forEach((element => {
        element.addEventListener('click', function() {
            const index = element.getAttribute('data-elementIndex');
            state.values.userCart.splice(index, 1);
            drawCartItems();
            localStorage.setItem('userCart', JSON.stringify(state.values.userCart))
        })
    }))
}

function initCarousel() {
  const carouselBox = document.querySelector('.carousel-inner');
  const indicatorsBox = document.querySelector('.carousel-indicators');

  for(let i = 0; i < service.viewImgs.length; i++) {
      carouselBox.innerHTML += `<div class="carousel-item ${i == 0 ? 'active' : ''}">
                                  <img src="${service.viewImgs[i].path}" class="w-100">
                              </div>`;

      indicatorsBox.innerHTML += `<button type="button" ${i == 0 ? 'class="active"' : ''}"
                                      data-bs-target="#carousel"
                                      data-bs-slide-to="${i}">
                                      <img src="${service.viewImgs[i].path}" alt="">
                                  </button>`
  }
}

  function suplyInfo() {
    document.getElementById('service-name').innerHTML = service.name;
    document.getElementById('preBooking-value').innerHTML = ToMoneyFormat(service.preBooking);

    const atractiveBox = document.querySelector('.atractives-box');
    const remarksViewList = document.getElementById('remarks-info'); 

    service.atractives.forEach((atractive) => {
        atractiveBox.innerHTML += `<div class="d-flex flex-row align-items-center w-100 mb-2">
                                        <i class="fs-2 me-3 bi ${atractive.iconClass}"></i> 
                                        <div class="d-flex flex-column">
                                            <span class="lh-1"><b>${atractive.title}</b></span>
                                            <span>${atractive.description}</span>
                                        </div>
                                    </div>`
    })

    document.getElementById('description-basic-info').innerHTML = `<li><b>Valor do Passio: </b>${ToMoneyFormat(service.value)} por adulto e ${ToMoneyFormat(service.kidValue)} para crianças de 04-09 anos.</li>
                                                                   <li><b>Forma de Pagamento: </b>Pré-reserva de ${ToMoneyFormat(service.preBooking)} e no dia do passeio ${ToMoneyFormat(service.value - service.preBooking)}.</li>`

    service.remarks.forEach((element) => {
        remarksViewList.innerHTML += `<li>${element.content}</li>`
    })

    document.getElementById('tuor-description').innerHTML = `<p>${service.description}</p>`
  }

  function stickyScroll() {
      if(window.scrollY <= priceCard.parentElement.offsetHeight - priceCard.offsetHeight) {
        state.views.priceCard.style.top = window.scrollY + "px";
      }
      
      if(window.scrollY < state.views.fixedTop.offsetHeight)
      {
        state.views.fixedTop.classList.add('invisible');
      } else{
        state.views.fixedTop.classList.remove('invisible');
      }
  }

  function calcAmount() {
    state.values.subTotal = (state.values.adultQtd * service.value) + (state.values.kidQtd * service.kidValue);
    state.views.subTotal.innerHTML = "Subtotal: " + ToMoneyFormat(state.values.subTotal);

    const adultSt = state.values.adultQtd > 0 ? `${state.values.adultQtd} Adultos, ` : '';
    const kidSt = state.values.kidQtd > 0 ? `${state.values.kidQtd} Crianças, ` : '';
    state.views.totalPessoas.innerHTML = adultSt + kidSt;
  }


  //Support funcions
  function ToMoneyFormat(string) {
    return string.toLocaleString(undefined, {style: 'currency', currency: 'BRL'})
  }

  function getMaxValue(value, value2) {
    if(value >= value2){
      return value;
    }

    return value2;
  }
  