export function formValidation() {
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

    const errorElem = e.currentTarget.closest('.input-form-wrapper').querySelector('.input-form-error');
    e.currentTarget.parentNode.classList.remove('error-form-input');
    errorElem.classList.add('hidden');

    e.currentTarget.parentNode.classList.remove('error-form-input');
  });

  surnameInput.addEventListener('change', (e) => {
    focused(e);

    const errorElem = e.currentTarget.closest('.input-form-wrapper').querySelector('.input-form-error');
    e.currentTarget.parentNode.classList.remove('error-form-input');
    errorElem.classList.add('hidden');

    e.currentTarget.parentNode.classList.remove('error-form-input');
  });

  emailInput.addEventListener('change', (e) => {
    focused(e);

    const errorElem = e.currentTarget.closest('.input-form-wrapper').querySelector('.input-form-error');

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

    const errorElem = e.currentTarget.closest('.input-form-wrapper').querySelector('.input-form-error');

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
    const errorElem = e.currentTarget.closest('.input-form-wrapper').querySelector('.input-form-error');

    errorElem.classList.add('hidden');
    purposeElem.classList.remove('hidden');

    if (e.currentTarget.closest('.error-form-input')) {
      e.currentTarget.closest('.error-form-input').classList.remove('error-form-input');
    }
  });

  tinInput.addEventListener('input', function () {
    if (this.value.length > 10) {
      this.value = this.value.slice(0, 10);
    }
  });

  orderButton.addEventListener('click', () => {
    formInputs.forEach((input) => {
      if (!input.value && input.closest('.input-form-wrapper').querySelector('.hidden')) {
        const errorElem = input.closest('.input-form-wrapper').querySelector('.hidden');

        errorElem.textContent = errorElem.dataset.empty;
        errorElem.classList.remove('hidden');

        const purposeElem = document.querySelector('.tin-purpose');
        purposeElem.classList.add('hidden');

        input.closest('.input-form-block').classList.add('error-form-input');
      }
    });
  });
}
