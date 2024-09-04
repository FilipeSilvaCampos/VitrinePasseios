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
    document.getElementById('adult-value').innerHTML = service.value.toLocaleString(undefined, {style: 'currency', currency: 'BRL'});
    document.getElementById('kid-value').innerHTML = service.kidValue.toLocaleString(undefined, {style: 'currency', currency: 'BRL'});

    const carouselBox = document.querySelector('.carousel-inner');
    for(let i = 0; i < service.viewImgs.length; i++) {
        carouselBox.innerHTML += `<div class="carousel-item ${i == 0 ? 'active' : ''}">
                                    <img src="${service.viewImgs[i].path}" class="w-100">
                                </div>`;
    }
  }

  function calcAmount() {
    state.values.subTotal = (state.values.adultQtd * service.value) + (state.values.kidQtd * service.kidValue);
    state.views.subTotal.innerHTML = state.values.subTotal.toLocaleString(undefined, {style: 'currency', currency: 'BRL'});
  }
  