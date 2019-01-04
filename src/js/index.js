
import domify from 'domify';
import _ from 'lodash';
import appTemplate from '../templates/app.html';
import paginationTemplate from '../templates/pagination.html';
import step1Template from '../templates/step1.html';
import step2Template from '../templates/step2.html';
import step3Template from '../templates/step3.html';
import step4Template from '../templates/step4.html';

let root = document.querySelector('#root');
let currentPage = 1;

root.appendChild(domify(_.template(appTemplate)({})));

let paginationContainer = root.querySelector('.pagination-container');
paginationContainer.appendChild(domify(_.template(paginationTemplate)()));
let paginationNavigator = document.querySelector('.pagination');
paginationNavigator.addEventListener('click', function(e) {
  e.preventDefault();
  let target;

  if (e.target.tagName === 'LI') {
    target = e.target.children[0];
  } else if (e.target.tagName === 'A') {
    target = e.target;
  } else {
    return;
  }
  displayStepN(target.textContent, info);
  currentPage = parseInt(target.textContent);
});

let templateList = [step1Template, step2Template, step3Template, step4Template];
var info = {
  policyAgreed: null,
  email: null,
  password: null,
  confirm: null,
  fullName: null,
  address: null,
  phoneNumber: null,
  homepageUrl: null
};

var flag = {
  homepageUrl: true,
  address: true
};

let contentContainer = root.querySelector('.content-container');

function renderTemplate (template, data) {
  if (!contentContainer.children.length) {
    contentContainer.appendChild(domify(_.template(template)(data)));
  } else {
    contentContainer.replaceChild(domify(_.template(template)(data)), contentContainer.children[0]);
  }
  return contentContainer;
}

displayStepN(1, info);

var validator = {
  email: function(value) {
    let emailPattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailPattern.test(value);
  },
  password: function(value) {
    return value.length >= 6;
  },
  confirm: function(value) {
    return value === info.password;
  },
  phoneNumber: function(value) {
    let phoneNumberPattern = /[0-9]{3}-[0-9]{3,4}-[0-9]{4}/;
    return phoneNumberPattern.test(value);
  },
  homepageUrl: function(value) {
    if (value === '') {
      return true;
    }
    let homepageUrlPattern = /https*:\/\/.*/;
    return homepageUrlPattern.test(value);
  },
  address: function() {
    return true;
  }
}

function switchClassInvalidOrNot (el, isValid=false) {
  let classList = Array.from(el.classList);

  if (!isValid && !classList.includes('is-invalid')) {
    el.classList.add('is-invalid');
  } else if (isValid && classList.includes('is-invalid')) {
    el.classList.remove('is-invalid');
  }
}

function activateButton (el, flag) {
  let classList = Array.from(el.classList);

  if (flag) {
    if (!Object.values(flag).includes(false) && classList.includes('disabled')) {
      el.classList.remove('disabled');
      el.classList.add('active');
    }
  } else {
    if (classList.includes('disabled')) {
      el.classList.remove('disabled');
      el.classList.add('active');
    }
  }
}

function deactivateButton (el) {
  let index = currentPage + 1;
  while (paginationNavigator.querySelector(`.page-item:nth-child(${ index })`)) {
    paginationNavigator.querySelector(`.page-item:nth-child(${ index })`).classList.add('disabled');
    paginationNavigator.querySelector(`.page-item:nth-child(${ index })`).classList.remove('passed');
    index++;
  }
  let classList = Array.from(el.classList);
  if (!classList.includes('disabled')) {
    el.classList.add('disabled');
    el.classList.remove('active');
  }
}

function getInputValidateEventHandler (key, button, validator) {
  function validate(value, validator) {
    return validator(value);
  }
  return function(e) {
    let testResult = validator ? validate(e.target.value, validator) : true;
    info[key] = e.target.value;

    if (testResult) {
      switchClassInvalidOrNot(e.target, true);
      flag[key] = true;
      console.log(flag)
      activateButton(button, flag);
    } else {
      switchClassInvalidOrNot(e.target);
      e.target.nextElementSibling.textContent = `invalid ${ key }`;
      flag[key] = false;
      deactivateButton(button);
    }
  };
}

function displayStepN (n, data) {
  if (typeof n !== 'number') n = parseInt(n);

  Array.prototype.forEach.call(paginationNavigator.querySelectorAll('.page-item'), function(item, i) {
    if (i === n - 1) {
      item.classList.remove('disabled');
      item.classList.add('active');
    } else if (i < n - 1) {
      item.classList.add('passed');
      item.classList.remove('active');
    } else {
      item.classList.remove('active')
    }
  });

  let contentContainer;
  let checkBox;
  let submitButton;
  let key;

  if (n === templateList.length) {
    contentContainer = renderTemplate(templateList[n - 1], data);
  } else if (n === 1) {
    contentContainer = renderTemplate(templateList[0], data);
    checkBox = contentContainer.querySelector('#agree');
    submitButton = contentContainer.querySelector('.btn-primary');

    if (info.policyAgreed) {
      checkBox.setAttribute('checked', true);
      submitButton.classList.remove('disabled');
    }

    checkBox.addEventListener('click', function(e) {
      if (checkBox.checked) activateButton(submitButton);
    });

    submitButton.addEventListener('click', function(e) {
      e.preventDefault();
      if (checkBox.checked) {
        info.policyAgreed = true;
        displayStepN(++currentPage, info);
      } else {
        info.policyAgreed = false;
        console.log('약관에 동의해주세요');
      }
    });
  } else {
    contentContainer = renderTemplate(templateList[n - 1], data);
    submitButton = contentContainer.querySelector('.btn-primary');
    submitButton.addEventListener('click', function(e) {
      e.preventDefault();
      displayStepN(++currentPage, info);
    });
    Array.prototype.forEach.call(contentContainer.querySelectorAll('input'), function(input) {
      if (input.id.includes('-')) {
        key = input.id.replace(/(-)(\w)/, function(match, p1, p2){
          return p2.toUpperCase();
        });
      } else {
        key = input.id;
      }
      input.addEventListener('input', getInputValidateEventHandler(key, submitButton, validator[key] || null));
      if (!flag.hasOwnProperty(key)) flag[key] = false;
      if (!flag[key]) {
        submitButton.classList.add('disabled');
      } else {
        submitButton.classList.remove('disabled');
      }
    });
  }
}
