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

    const countPlus = document.querySelectorAll('.good-count-plus');
    const countMinus = document.querySelectorAll('.good-count-minus');
    const countInputs = document.querySelectorAll('.good-count-input');

    favorites.forEach((favorite) => {
      favorite.addEventListener('click', (e) => {
        e.target.classList.toggle('favorite');
      });
    });

    function checkboxChange() {
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
    }

    deletes.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.target.classList.toggle('deleted');
      });
    });

    chooseAll.addEventListener('change', checkboxChange);

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
        checkboxChange();
      });
    });

    countPlus.forEach((button, index) => {
      button.addEventListener('click', (e) => {
        if (!e.currentTarget.classList.contains('disabled')) {
          countInputs[index].value++;
        }
        if (countInputs[index].value >= 999) {
          button.classList.add('disabled');
        }
        if (countInputs[index].value <= 998) {
          countMinus[index].classList.remove('disabled');
        }
      });
    });

    countMinus.forEach((button, index) => {
      button.addEventListener('click', (e) => {
        if (!e.currentTarget.classList.contains('disabled')) {
          countInputs[index].value--;
        }
        if (countInputs[index].value <= 1) {
          button.classList.add('disabled');
        }
        if (countInputs[index].value >= 2) {
          countPlus[index].classList.remove('disabled');
        }
      });
    });

    countInputs.forEach((input, index) => {
      input.addEventListener('input', () => {
        if (input.value >= 999) {
          input.value = 999;
          countPlus[index].classList.add('disabled');
        } else {
          countPlus[index].classList.remove('disabled');
        }

        if (input.value <= 1) {
          input.value = 1;
          countMinus[index].classList.add('disabled');
        } else {
          countMinus[index].classList.remove('disabled');
        }
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

  function formValidation() {
    const form = document.querySelector('.receiver-form');
    const formInputs = document.querySelectorAll('form input');
    const orderButton = document.querySelector('#make-order');

    const nameInput = document.querySelector('#name-input-form');
    const surnameInput = document.querySelector('#surname-input-form');
    const emailInput = document.querySelector('#email-input-form');
    const telInput = document.querySelector('#tel-input-form');
    const tinInput = document.querySelector('#tin-input-form');

    function focused(e) {
      e.currentTarget.classList.add('focused');

      if (!e.currentTarget.value) {
        e.currentTarget.classList.remove('focused');
      }
    }

    nameInput.addEventListener('change', (e) => {
      focused(e);

      const errorElem = e.currentTarget.parentNode.querySelector('.input-form-error');
      e.currentTarget.parentNode.classList.remove('error-form-input');
      errorElem.classList.add('hidden');

      e.currentTarget.parentNode.classList.remove('error-form-input');
    });

    surnameInput.addEventListener('change', (e) => {
      focused(e);

      const errorElem = e.currentTarget.parentNode.querySelector('.input-form-error');
      e.currentTarget.parentNode.classList.remove('error-form-input');
      errorElem.classList.add('hidden');

      e.currentTarget.parentNode.classList.remove('error-form-input');
    });

    emailInput.addEventListener('change', (e) => {
      focused(e);
      const errorElem = e.currentTarget.parentNode.querySelector('.input-form-error');

      if (!e.currentTarget.value || e.currentTarget.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
        e.currentTarget.parentNode.classList.remove('error-form-input');

        errorElem.classList.add('hidden');
      } else if (!e.currentTarget.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
        errorElem.textContent = errorElem.dataset.error;
        errorElem.classList.remove('hidden');

        e.currentTarget.parentNode.classList.add('error-form-input');
      }
    });

    telInput.addEventListener('change', (e) => {
      focused(e);
      const errorElem = e.currentTarget.parentNode.querySelector('.input-form-error');

      if (!e.currentTarget.value || e.currentTarget.value.match(/\+\d \d{3} \d{3} \d{2} \d{2}/)) {
        e.currentTarget.parentNode.classList.remove('error-form-input');

        errorElem.classList.add('hidden');
      } else if (!e.currentTarget.value.match(/\+\d \d{3} \d{3} \d{2} \d{2}/)) {
        errorElem.textContent = errorElem.dataset.error;
        errorElem.classList.remove('hidden');

        e.currentTarget.parentNode.classList.add('error-form-input');
      }
    });

    tinInput.addEventListener('change', (e) => {
      focused(e);

      const purposeElem = document.querySelector('.tin-purpose');
      const errorElem = e.currentTarget.parentNode.querySelector('.input-form-error');
      errorElem.classList.add('hidden');
      purposeElem.classList.remove('hidden');

      e.currentTarget.parentNode.parentNode.classList.remove('error-form-input');
    });

    tinInput.addEventListener('input', function () {
      if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
      }
    });

    orderButton.addEventListener('click', () => {
      formInputs.forEach((input) => {
        if (!input.value && input.parentNode.querySelector('.hidden')) {
          const errorElem = input.parentNode.querySelector('.hidden');

          errorElem.textContent = errorElem.dataset.empty;
          errorElem.classList.remove('hidden');

          if (input.parentNode.classList.value !== 'input-form-block') {
            const purposeElem = document.querySelector('.tin-purpose');
            purposeElem.classList.add('hidden');

            input.parentNode.parentNode.classList.add('error-form-input');
          } else {
            input.parentNode.classList.add('error-form-input');
          }
        }
      });

      const inputArray = [...formInputs];

      const result = inputArray.some((item) => item.parentNode.classList.contains('error-form-input'));
      console.log(result);
    });
  }

  cart();
  summary();
  formValidation();
});
