window.addEventListener('DOMContentLoaded', () => {
  function cart() {
    const favorites = document.querySelectorAll('.good-favorite-image');
    const deletes = document.querySelectorAll('.good-delete-image');
    const chooseAll = document.querySelector('#choose-all');
    const chooseCheckbox = document.querySelectorAll('.good .input-checked');
    const buttonsExpand = document.querySelectorAll('.triangle');
    const goodsWrappers = document.querySelectorAll('.good-wrapper');
    const chooseText = document.querySelector('.choose-text');
    const hiddenChooseText = document.querySelector('.hidden-choose-text');
    const labelCheckbox = document.querySelector('#choose-all-label');

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

        chooseAll.checked = inputArray.every((item) => item.checked);
      });
    });

    buttonsExpand.forEach((button, index) => {
      button.addEventListener('click', (e) => {
        const expandList = goodsWrappers[index];

        expandList.classList.toggle('open');

        if (expandList.classList.contains('open')) {
          e.currentTarget.setAttribute('aria-expanded', true);
          e.currentTarget.style.transform = 'rotate(45deg)';

          expandList.setAttribute('aria-hidden', false);
          expandList.style.maxHeight = expandList.scrollHeight + 'px';
        } else {
          e.currentTarget.setAttribute('aria-expanded', false);
          e.currentTarget.style.transform = 'rotate(-135deg)';

          expandList.setAttribute('aria-hidden', true);
          expandList.style.maxHeight = 0;
        }

        if (expandList.parentNode.classList.contains('available-goods') && !expandList.classList.contains('open')) {
          hiddenChooseText.textContent = '266 товаров · 2 100 569 сом';

          labelCheckbox.style.display = 'none';
          chooseText.style.display = 'none';
        } else if (
          expandList.parentNode.classList.contains('available-goods') &&
          expandList.classList.contains('open')
        ) {
          hiddenChooseText.textContent = '';

          labelCheckbox.style.display = 'block';
          chooseText.style.display = 'block';
        }
      });

      chooseText.addEventListener('click', (e) => {
        e.stopImmediatePropagation();

        const inputCheckbox = document.querySelector('#choose-all');
        inputCheckbox.checked = !inputCheckbox.checked;
      });
    });
  }

  function summary() {
    const summaryCheck = document.querySelector('#payment-check');
    const buttonOrder = document.querySelector('.custom-button');
    const totalPrice = document.querySelector('#total-price');

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
