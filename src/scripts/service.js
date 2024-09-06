const state = {
    views: {
        adultQtd: document.getElementById("adult-qtd"),
        kidQtd: document.getElementById('kid-qtd'),
        subTotal: document.getElementById('subtotal'),
        totalPessoas: document.getElementById('total-pessoas')
    },

    values: {
        adultQtd: 0,
        kidQtd: 0,
        subTotal: 0
    }
}

const urlParams = new URLSearchParams(window.location.search,);
let service;

fetch("./src/data.json").then((response) => {
    response.json().then((data) => {
         service = data.servicos[urlParams.get('service')];

         initAmountButtons();
         initViews();
    });
}) 

  function initAmountButtons() {
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
  }

  function initViews() {
    document.getElementById('adult-value').innerHTML = ToMoneyFormat(service.value);
    document.getElementById('kid-value').innerHTML = ToMoneyFormat(service.kidValue);

    initCarousel();
    suplyInfo();
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

  function calcAmount() {
    state.values.subTotal = (state.values.adultQtd * service.value) + (state.values.kidQtd * service.kidValue);
    state.views.subTotal.innerHTML = "Subtotal: " + ToMoneyFormat(state.values.subTotal);

    const adultSt = state.values.adultQtd > 0 ? `${state.values.adultQtd} Adultos, ` : '';
    const kidSt = state.values.kidQtd > 0 ? `${state.values.kidQtd} Crianças, ` : '';
    state.views.totalPessoas.innerHTML = adultSt + kidSt;
  }

  function ToMoneyFormat(string) {
    return string.toLocaleString(undefined, {style: 'currency', currency: 'BRL'})
  }

  function getMaxValue(value, value2) {
    if(value >= value2){
      return value;
    }

    return value2;
  }
  