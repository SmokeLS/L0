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
    const inputCheckbox = document.querySelector('#choose-all');

    const countPlus = document.querySelectorAll('.good-count-plus');
    const countMinus = document.querySelectorAll('.good-count-minus');
    const countInputs = document.querySelectorAll('.good-count-input');

    const deliveryDate = document.querySelectorAll('.delivery-date');

    favorites.forEach((favorite) => {
      favorite.addEventListener('click', (e) => {
        e.target.classList.toggle('favorite');

        e.target.classList.contains('favorite')
          ? e.target.closest('.good-icons').classList.add('show')
          : e.target.closest('.good-icons').classList.remove('show');
      });
    });

    function checkboxChange() {
      if (chooseAll.checked) {
        chooseCheckbox.forEach((checkbox, index) => {
          checkbox.checked = true;
          togglePicture(checkbox.checked, index);
        });
      }

      if (!chooseAll.checked) {
        chooseCheckbox.forEach((checkbox, index) => {
          checkbox.checked = false;
          togglePicture(checkbox.checked, index);
        });
      }
    }

    deletes.forEach((item) => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('.modal-address')) {
          e.target.closest('.modal-address').remove();
        }

        if (e.target.closest('.modal-issue')) {
          e.target.closest('.modal-issue').remove();
        }

        if (e.target.closest('.good')) {
          e.target.closest('.good').remove();
        }

        summary();
      });
    });

    chooseAll.addEventListener('change', checkboxChange);
    chooseAll.addEventListener('change', checkOrderSum);
    chooseAll.addEventListener('change', findGoodCounts);

    chooseCheckbox.forEach((checkbox, index) => {
      checkbox.addEventListener('change', () => {
        const inputArray = [...chooseCheckbox];

        chooseAll.checked = inputArray.every((item) => item.checked);
      });

      checkbox.addEventListener('change', summary);
      checkbox.addEventListener('change', () => togglePicture(checkbox.checked, index));
      checkbox.addEventListener('change', checkOrderSum);
    });

    buttonsExpand.forEach((button, index) => {
      button.addEventListener('click', (e) => {
        const expandList = goodsWrappers[index];
        const totalCost = findSum();
        const totalCounts = findGoodCounts();

        const good = goodToStr('товар', totalCounts);

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
          hiddenChooseText.textContent = `${totalCounts} ${good} · ${totalCost} сом`;

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

        inputCheckbox.checked = !inputCheckbox.checked;
        checkboxChange();
        summary();
        changeCountsCosts();
        checkOrderSum();
      });

      inputCheckbox.addEventListener('change', summary);
    });

    countPlus.forEach((button, index) => {
      button.addEventListener('click', (e) => {
        const remainsNumber = button.closest('.good-options').querySelector('.good-remain-number') ?? 999;

        if (!e.currentTarget.classList.contains('disabled')) {
          countInputs[index].value++;

          changePrice(countInputs[index]);
        }

        if (
          countInputs[index].value >= 999 ||
          (remainsNumber.textContent <= +countInputs[index].value && remainsNumber !== 999)
        ) {
          button.classList.add('disabled');
        }

        if (countInputs[index].value <= 998) {
          countMinus[index].classList.remove('disabled');
        }

        changeCountsCosts();
      });
    });

    countMinus.forEach((button, index) => {
      button.addEventListener('click', (e) => {
        if (!e.currentTarget.classList.contains('disabled')) {
          countInputs[index].value--;

          changePrice(countInputs[index]);
        }

        if (countInputs[index].value <= 1) {
          button.classList.add('disabled');
        }

        if (countInputs[index].value >= 2) {
          countPlus[index].classList.remove('disabled');
        }

        changeCountsCosts();
      });
    });

    function changePrice(input) {
      const goodCost = input.closest('.good').querySelector('.good-cost');
      const prevGoodCost = input.closest('.good').querySelector('.prev-good-cost');
      const discountPercentage = input.closest('.good').querySelectorAll('.discont-percentage-tooltip');
      const discountPrice = input.closest('.good').querySelectorAll('.discont-price-tooltip');

      goodCost.textContent = +goodCost.dataset.price * +input.value;

      prevGoodCost.textContent = +prevGoodCost.dataset.price * +input.value;
      
      discountPercentage.forEach((discount, index) => {
        discount.textContent = `${(
          (((prevGoodCost.dataset.price - goodCost.dataset.price) / prevGoodCost.dataset.price) * 100) /
          2
        ).toFixed(1)}%`;

        discountPrice[index].textContent = (prevGoodCost.textContent - goodCost.textContent) / 2;
      });


      goodCost.textContent = `${goodCost.textContent
        .toString()
        .match(/\d{1,3}(?=(\d{3})*$)/g)
        .join(' ')} `;

      prevGoodCost.textContent = `${prevGoodCost.textContent
        .toString()
        .match(/\d{1,3}(?=(\d{3})*$)/g)
        .join(' ')} `;

      summary();
      checkOrderSum();
    }

    countInputs.forEach((input, index) => {
      input.addEventListener('input', () => {
        const remainsNumber = input.closest('.good-options').querySelector('.good-remain-number') ?? 999;
        if (input.value >= 999 || (remainsNumber.textContent <= +countInputs[index].value && remainsNumber !== 999)) {
          input.value = remainsNumber.textContent ?? remainsNumber;
          changePrice(input);

          countPlus[index].classList.add('disabled');
        } else {
          changePrice(input);

          countPlus[index].classList.remove('disabled');
        }

        if (input.value <= 1) {
          input.value = 1;
          changePrice(input);

          countMinus[index].classList.add('disabled');
        } else {
          changePrice(input);

          countMinus[index].classList.remove('disabled');
        }
      });
      changePrice(input);
    });
  }

  function summary() {
    const summaryCheck = document.querySelector('#payment-check');

    changeCountsCosts();

    summaryCheck.addEventListener('change', checkOrderSum);
  }

  function togglePicture(check, index) {
    const pictures = document.querySelectorAll(`[data-index='${index}']`);

    pictures.forEach((picture) => {
      if (!check) {
        picture.classList.add('hidden');

        if (!picture.closest('.delivery-date').querySelector('.delivery-image-block:not(.hidden)')) {
          picture.closest('.delivery-date').classList.add('hidden');
        }
      } else {
        picture.classList.remove('hidden');

        if (picture.closest('.delivery-date').querySelector('.delivery-image-block')) {
          picture.closest('.delivery-date').classList.remove('hidden');
        }
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
        if (!input.value && input.parentNode.querySelector('.hidden')) {
          const errorElem = input.parentNode.querySelector('.hidden');

          errorElem.textContent = errorElem.dataset.empty;
          errorElem.classList.remove('hidden');

          const purposeElem = document.querySelector('.tin-purpose');
          purposeElem.classList.add('hidden');

          input.closest('.input-form-block').classList.add('error-form-input');
        }
      });

      const inputArray = [...formInputs];

      const result = inputArray.some((item) => item.closest('.error-form-input'));
    });
  }

  function findSum() {
    const goodsPrice = document.querySelectorAll('.good-cost');
    const chooseCheckbox = document.querySelectorAll('.good .input-checked');

    let totalCost = 0;

    goodsPrice.forEach((item, index) => {
      const itemPrice = item.textContent.replace(/\s/g, '');

      if (chooseCheckbox[index].checked) {
        totalCost += +itemPrice;
      }
    });

    const formatedTotalCost = totalCost
      .toString()
      .match(/\d{1,3}(?=(\d{3})*$)/g)
      .join(' ');

    return formatedTotalCost;
  }

  function findPrevSum() {
    const goodsPrevPrice = document.querySelectorAll('.prev-good-cost');
    const chooseCheckbox = document.querySelectorAll('.good .input-checked');

    let prevTotalCost = 0;

    goodsPrevPrice.forEach((item, index) => {
      const itemCounts = item.textContent.replace(/\s/g, '');

      if (chooseCheckbox[index].checked) {
        prevTotalCost += +itemCounts;
      }
    });

    const formatedTotalCost = prevTotalCost
      .toString()
      .match(/\d{1,3}(?=(\d{3})*$)/g)
      .join(' ');

    return formatedTotalCost;
  }

  function checkOrderSum() {
    const summaryCheck = document.querySelector('#payment-check');
    const buttonOrder = document.querySelector('.custom-button');

    const totalCost = findSum();

    changeCountsCosts();

    if (summaryCheck.checked) {
      buttonOrder.value = `Оплатить ${totalCost} сом`;
    } else {
      buttonOrder.value = 'Заказать';
    }
  }

  function findGoodCounts() {
    const goodsPrice = document.querySelectorAll('.good-cost');
    const chooseCheckbox = document.querySelectorAll('.good .input-checked');
    const countInputs = document.querySelectorAll('.good-count-input');

    let totalCounts = 0;

    countInputs.forEach((item, index) => {
      if (chooseCheckbox[index].checked) {
        totalCounts += +item.value;
      }
    });

    const formatedTotalCounts = totalCounts
      .toString()
      .match(/\d{1,3}(?=(\d{3})*$)/g)
      .join(' ');

    return formatedTotalCounts;
  }

  // работает для ограниченного количества слов
  function goodToStr(good, totalCounts) {
    let goodString = good;

    switch (totalCounts % 10) {
      case 2:
      case 3:
      case 4: {
        goodString = `${good}а`;
        break;
      }
      default: {
        goodString = `${good}ов`;
      }
    }

    return goodString;
  }

  function changeCountsCosts() {
    const asideCounts = document.querySelector('.aside-caption');
    const totalPrice = document.querySelector('#total-price');
    const asidePrice = document.querySelector('.aside-total-price');
    const asideDiscount = document.querySelector('.aside-total-discount');

    const totalCost = findSum();
    const totalPrevCost = findPrevSum();
    const totalCounts = findGoodCounts();
    const good = goodToStr('Товар', totalCounts);

    const diffDiscount = totalPrevCost.replace(/\s/g, '') - totalCost.replace(/\s/g, '');
    const formatedDiffDiscount = diffDiscount
      .toString()
      .match(/\d{1,3}(?=(\d{3})*$)/g)
      .join(' ');

    totalPrice.textContent = `${totalCost} сом`;
    asideCounts.textContent = `${totalCounts} ${good}`;
    asidePrice.textContent = `${totalPrevCost} сом`;
    asideDiscount.textContent = `-${formatedDiffDiscount} сом`;
  }

  function modal() {
    const modals = document.querySelectorAll('.modal');
    const btnCloseModal = document.querySelectorAll('[data-close]');
    const addressModalBtns = document.querySelectorAll('.address-button');
    const paycardModalBtns = document.querySelectorAll('.paycard-button');

    const chooseAddressBtn = document.querySelector('#choose-address');
    const chooseCardBtn = document.querySelector('#choose-card');

    const addressChooseBtns = document.querySelectorAll('.modal-button');

    addressChooseBtns.forEach((button) => {
      button.addEventListener('click', () => {
        const modalAddresses = document.querySelectorAll('.modal-address');
        const modalIssues = document.querySelectorAll('.modal-issue');

        addressChooseBtns.forEach((button) => {
          button.classList.remove('chosen-button');
        });

        button.classList.add('chosen-button');

        if (button.classList.contains('choose-delivery-courier')) {
          modalAddresses.forEach((address) => {
            address.classList.remove('hidden');
          });
          modalIssues.forEach((issue) => {
            issue.classList.add('hidden');
          });
        } else {
          modalAddresses.forEach((address) => {
            address.classList.add('hidden');
          });
          modalIssues.forEach((issue) => {
            issue.classList.remove('hidden');
          });
        }
      });
    });

    addressModalBtns.forEach((button) => {
      button.addEventListener('click', () => {
        const modalAddress = document.querySelector('.modal-delivery');

        modalAddress.classList.remove('hidden');
      });
    });

    paycardModalBtns.forEach((button) => {
      button.addEventListener('click', () => {
        const modalAddress = document.querySelector('.modal-payment');

        modalAddress.classList.remove('hidden');
      });
    });

    btnCloseModal.forEach((button) => {
      button.addEventListener('click', () => {
        modals.forEach((modal) => {
          closeModal(modal);
        });
      });
    });

    function closeModal(modalSelector) {
      modalSelector.classList.add('hidden');
    }

    chooseAddressBtn.addEventListener('click', () => {
      const checkedInputAddresses = document.querySelectorAll('.modal-address input');
      const checkedInputIssues = document.querySelectorAll('.modal-issue input');

      const chosenDeliveryAddresses = document.querySelectorAll('.delivery-address');
      const chosenDeliveryStars = document.querySelectorAll('.delivery-star-text');
      const chosenDeliveryRates = document.querySelectorAll('.delivery-rate-text');

      checkedInputAddresses.forEach((button) => {
        if (!button.checked) return;

        const chooseDeliveryCourierBtn = document.querySelector('.choose-delivery-courier');

        if (chooseDeliveryCourierBtn.classList.contains('chosen-button')) {
          const deliveryAddress = button.closest('.modal-address').querySelector('.modal-card-courier');

          chosenDeliveryAddresses.forEach((chosenDeliveryAddress) => {
            chosenDeliveryAddress.textContent = deliveryAddress.textContent;
          });

          chosenDeliveryStars.forEach((chosenDeliveryStar) => {
            chosenDeliveryStar.textContent = '';
          });

          chosenDeliveryRates.forEach((chosenDeliveryRate) => {
            chosenDeliveryRate.textContent = '';
          });

          modals.forEach((modal) => {
            closeModal(modal);
          });
        }
      });

      checkedInputIssues.forEach((button) => {
        if (!button.checked) return;

        const chooseDeliveryIssueBtn = document.querySelector('.choose-delivery-issue');

        if (chooseDeliveryIssueBtn.classList.contains('chosen-button')) {
          const deliveryAddress = button.closest('.modal-issue').querySelector('.modal-text-address');
          const deliveryStar = button.closest('.modal-issue').querySelector('.delivery-star');
          const deliveryRate = button.closest('.modal-issue').querySelector('.delivery-rate');

          chosenDeliveryAddresses.forEach((chosenDeliveryAddress) => {
            chosenDeliveryAddress.textContent = deliveryAddress.textContent;
          });

          chosenDeliveryStars.forEach((chosenDeliveryStar) => {
            chosenDeliveryStar.textContent = deliveryStar.textContent;
          });

          chosenDeliveryRates.forEach((chosenDeliveryRate) => {
            chosenDeliveryRate.textContent = deliveryRate?.textContent ?? '';
          });

          modals.forEach((modal) => {
            closeModal(modal);
          });
        }
      });
    });

    chooseCardBtn.addEventListener('click', () => {
      const checkedInput = document.querySelectorAll('.modal-card input');

      checkedInput.forEach((button) => {
        if (!button.checked) return;

        const chosenPaycardIcons = document.querySelectorAll('.chosen-paycard-icon');
        const chosenPaycardNumbers = document.querySelectorAll('.chosen-paycard-number');

        const paycardIcon = button.closest('.modal-card').querySelector('.paycard-icon');
        const paycardNumber = button.closest('.modal-card').querySelector('.paycard-number');

        chosenPaycardIcons.forEach((chosenPaycardIcon) => {
          chosenPaycardIcon.src = paycardIcon.src;
        });

        chosenPaycardNumbers.forEach((chosenPaycardNumber) => {
          chosenPaycardNumber.textContent = paycardNumber.textContent;
        });

        modals.forEach((modal) => {
          closeModal(modal);
        });
      });
    });

    modals.forEach((modal) => {
      modal.addEventListener('click', function (event) {
        const target = event.target;

        if (target && target === this) {
          closeModal(modal);
        }
      });
    });

    window.addEventListener('keyup', (event) => {
      modals.forEach((modal) => {
        if (event.key == 'Escape' && !modal.classList.contains('hidden')) {
          closeModal(modal);
        }
      });
    });
  }

  cart();
  summary();
  formValidation();
  modal();
});

// if (notification.dataset.max < input.value) {
//   const newBlock = document.createElement("div");
//   newBlock.classList.add("delivery-option");
//   newBlock.classList.add("delivery-date");

//   newBlock.innerHTML = `<div class="delivery-caption">7—8 февраля</div>
//                         <div class="delivery-images-block">
//                           <div class="delivery-image-block">
//                             <img src="./img/photo-2.png" alt="case" class="delivery-image" />
//                             <div class="notification" data-max="999">16</div>
//                           </div>
//                         </div>`;

//   deliveryBlock.insertAdjacentElement('beforeBegin', newBlock);
// }

// deliveryDate.forEach(dateBlocks => {
//   const imageBlocks = dateBlocks.querySelectorAll(`[data-index='${index}']`);

//   imageBlocks.forEach((imageBlock, imageIndex) => {
//     const notification = imageBlock.querySelector('.notification');

//     if (tempValue + +notification.dataset.max < input.value) {
//       const newBlock = document.createElement("div");
//       newBlock.classList.add("delivery-option");
//       newBlock.classList.add("delivery-date");

//       newBlock.innerHTML = `<div class="delivery-caption">7—8 февраля</div>
//                             <div class="delivery-images-block" data-index='${index}'>
//                               <div class="delivery-image-block">
//                                 <img src="./img/photo-2.png" alt="case" class="delivery-image" />
//                                 <div class="notification" data-max="222">16</div>
//                               </div>
//                             </div>`;

//       deliveryBlock.insertAdjacentElement('beforeBegin', newBlock);
//       tempValue += +notification.dataset.max;
//     }
//   });

// });
