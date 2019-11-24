// import jQuery from "jquery";
// import popper from "popper.js";
// import bootstrap from "bootstrap";
import IMask from 'imask';

window.onload = function () {
  const form = document.querySelector('.form').addEventListener('submit', function (e) {
    e.preventDefault();
  });

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
}