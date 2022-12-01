window.addEventListener('DOMContentLoaded', () => {
  function cart() {
    const favorites = document.querySelectorAll('.good-favorite-image');
    const deletes = document.querySelectorAll('.good-delete-image');
    const chooseAll = document.querySelector('#choose-all');
    const chooseCheckbox = document.querySelectorAll('.good .input-checked');

    favorites.forEach((favorite) => {
      favorite.addEventListener('click', (e) => {
        e.target.classList.toggle('favorite');
      });
    });

    deletes.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.target.classList.toggle('deleted');
      });
    });

    chooseAll.addEventListener('click', () => {
      if (chooseAll.checked) {
        chooseCheckbox.forEach((checkbox) => {
          checkbox.checked = true;
        });
      }

      if (!chooseAll.checked) {
        chooseCheckbox.forEach((checkbox) => {
          checkbox.checked = false;
        });
      }
    });

    chooseCheckbox.forEach((checkbox) => {
      checkbox.addEventListener('click', () => {

        const inputArray = [...document.querySelectorAll('.good .input-checked')];

        chooseAll.checked = inputArray.every(item => item.checked);
      });
    });

    // chooseAll.checked = false;
  }

  function summary() {
    const summaryCheck = document.querySelector('#payment-check');
    const buttonOrder = document.querySelector('.custom-button');
    const totalPrice = document.querySelector("#total-price");

    summaryCheck.addEventListener('click', () => {
      if (summaryCheck.checked) {
        buttonOrder.value = `Оплатить ${totalPrice.textContent}`;
      } else {
        buttonOrder.value = 'Заказать';
      }
    });
  }

  cart();
  summary();
});
