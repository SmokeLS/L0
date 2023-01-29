import { summary, changeCountsCosts, checkOrderSum, findSum, findGoodCounts, goodToStr } from './summary.js';

export function cart() {
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

  const unavailable = document.querySelector('.unavailable');

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

  deletes.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.modal-address')) {
        e.target.closest('.modal-address').remove();
      }

      if (e.target.closest('.modal-issue')) {
        e.target.closest('.modal-issue').remove();
      }

      if (e.target.closest('.good')) {
        let countValue = e.target.closest(".good-options").querySelector('.good-count-input').value;
        countValue = 0;

        togglePicture(countValue, index);

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

        if (expandList.closest(".unavailable-goods")) {
          unavailable.classList.remove('without-border');
        }

        expandList.setAttribute('aria-hidden', false);
        expandList.style.maxHeight = expandList.scrollHeight + 'px';
      } else {
        e.currentTarget.setAttribute('aria-expanded', false);
        e.currentTarget.style.transform = 'rotate(-135deg)';

        if (expandList.closest(".unavailable-goods")) {
          unavailable.classList.add('without-border');
        }

        expandList.setAttribute('aria-hidden', true);
        expandList.style.maxHeight = 0;
      }

      if (expandList.parentNode.classList.contains('available-goods') && !expandList.classList.contains('open')) {
        hiddenChooseText.textContent = `${totalCounts} ${good} · ${totalCost} сом`;

        labelCheckbox.style.display = 'none';
        chooseText.style.display = 'none';
      } else if (expandList.parentNode.classList.contains('available-goods') && expandList.classList.contains('open')) {
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

      const countItems = countInputs[index].value;
      
      changeDeliveryCounts(countItems, index);
      
      changeCountsCosts();
      // pictures.forEach((pictureBlock, index) => {
      //     let notification = pictureBlock.querySelector('.notification');

      //     if (+notification.dataset.max <= +countItems) {
      //       notification.textContent = Math.min(countItems, notification.dataset.max);
      //       countItems -= +notification.dataset.max;
      //     } else {
      //       notification.textContent = Math.min(countItems, notification.dataset.max);
      //     }
      // });
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

      const countItems = countInputs[index].value;
      
      changeDeliveryCounts(countItems, index);

      changeCountsCosts();
    });
  });

  function changePrice(input) {
    const goodCost = input.closest('.good').querySelector('.good-cost');
    const prevGoodCost = input.closest('.good').querySelector('.prev-good-cost');
    const discountPercentage = input.closest('.good').querySelectorAll('.discont-percentage-tooltip');
    const discountPrice = input.closest('.good').querySelectorAll('.discont-price-tooltip');

    goodCost.textContent = +goodCost.dataset.price * +input.value;

    if (+goodCost.textContent > 999) {
      goodCost.closest(".good-total-price").classList.remove("big-price");
    }

    if (+goodCost.textContent <= 999) {
      goodCost.closest(".good-total-price").classList.add("big-price");
    }
    
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

      changeDeliveryCounts(countInputs[index].value, index);
    });

    changePrice(input);

    countInputs.forEach((item, index) => {
      changeDeliveryCounts(item.value, index);
    });
  });
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

function changeDeliveryCounts(countItems, index) {
  const pictures = document.querySelectorAll(`[data-index='${index}']`);

  for (let i = 0; i < pictures.length; i++) {
    pictures[i].querySelector('.notification').textContent = 0;
  }
  
  for (let i = 0; i < pictures.length; i++) {
      let notification = pictures[i].querySelector('.notification');

      if (+notification.dataset.max <= +countItems) {
        notification.textContent = Math.min(countItems, notification.dataset.max);

        notification.textContent < 2 ? notification.classList.add('hidden') : notification.classList.remove('hidden');
        notification.textContent < 1 ? 
          notification.closest(".delivery-date").classList.add("hidden") :
          notification.closest(".delivery-date").classList.remove("hidden");

        countItems -= +notification.dataset.max;
      } else {
        notification.textContent = Math.min(countItems, notification.dataset.max);

        notification.textContent < 2 ? notification.classList.add('hidden') : notification.classList.remove('hidden');
        notification.textContent < 1 ? 
          notification.closest(".delivery-date").classList.add("hidden") :
          notification.closest(".delivery-date").classList.remove("hidden");

        break;
      }
  }
}