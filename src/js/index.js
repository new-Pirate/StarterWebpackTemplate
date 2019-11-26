// import jQuery from "jquery";
// import popper from "popper.js";
// import bootstrap from "bootstrap";
import IMask from 'imask';

window.onload = function () {

  /* Телефонная маска */

  IMask(document.querySelector('.form-tel-input'), {
    mask: [
      {
        mask: '0 (000) 000-00-00',
        startsWith: '8',
        lazy: false,
      },
      {
        mask: '+0 (000) 000-00-00',
        startsWith: '7',
        lazy: false,
      }
    ],
    dispatch: function (appended, dynamicMasked) {
      var number = (dynamicMasked.value + appended).replace(/\D/g, '');

      return dynamicMasked.compiledMasks.find(function (m) {
        return number.indexOf(m.startsWith) === 0;
      });
    }
  });

  /* Валидация ввода телефона */
  const telRegExp = /(8|\+7)\s?[ ][\(][0-9]{3}[\)][ ]{0,1}\s?\d{3}[-]{0,1}\d{2}[-]{0,1}\d{2}/;
  const form = document.querySelector('.form');
  const telInput = document.querySelector('.form-tel-input');
  const telError = document.querySelector('.form-tel-error');

  telInput.addEventListener('input', function () {
    const text = telInput.value.length !== 0 && telRegExp.test(telInput.value);
    if (text) {
      telInput.classList.remove('error-input');
    } else {
      telInput.classList.add('error-input');
    }
  });

  form.addEventListener('submit', function (event) {
    const text = telInput.value.length !== 0 && telRegExp.test(telInput.value);
    if (text) {
      telInput.classList.remove('error-input');
      telError.classList.remove('error-text');
    } else {
      telInput.classList.add('error-input');
      telError.classList.add('error-text');
      event.preventDefault();
    }
  });

  /* передача валидности полей WebView */

  function getFieldValidChenged() {
    
  }
}