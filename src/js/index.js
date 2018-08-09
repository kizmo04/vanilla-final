
import domify from 'domify';
import _ from 'lodash';
import paginationTemplate from '../templates/pagination.html';
import step1Template from '../templates/step1.html';
import step2Template from '../templates/step2.html';
import step3Template from '../templates/step3.html';
import step4Template from '../templates/step4.html';


let root = document.querySelector('#root');

  step4.replaceChild(domify(_.template(step4Template)(info)), step4.children[0]);


let step1 = root.querySelector('.step1');
let step2 = root.querySelector('.step2');
let step3 = root.querySelector('.step3');
let step4 = root.querySelector('.step4');

let paginationNavigator = document.querySelector('.pagination');

let pageList = [step1, step2, step3, step4];
let info = {};
// window.history.pushState({ name: 'step1' }, 'step1', '/steps/1');

const Component = function() {
  this.target = options.target;
  this.template = options.template;
  this.data = options.data;
}





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
  displayStepN(target.textContent);
});


// step1
let submit = step1.querySelector('.btn-primary');
let checkBox = step1.querySelector('.form-check-input');

checkBox.addEventListener('click', function(e) {
  if (checkBox.checked) activateButton(submit);
});

submit.addEventListener('click', function(e) {
  e.preventDefault();
  if (checkBox.checked) {
    info.policyAgreed = true;
    displayStepN(2);
    // window.history.pushState({ name: 'step2' }, 'step2', '/steps/2');
  } else {
    console.log('약관에 동의해주세요');
  }
});


// step2
let email = step2.querySelector('#email');
let password = step2.querySelector('#password');
let confirm = step2.querySelector('#confirm');
let passwordOrigin;
let submitStep2 = step2.querySelector('.btn-primary');
let flag = {};

if (email.value === '') {
  email.classList.add('is-invalid');
  email.nextElementSibling.textContent = 'Please enter your e-mail.';
}



email.addEventListener('input', getInputValidateEventHandler('email', submitStep2, function(value) {
  let emailPattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailPattern.test(value);
}));

password.addEventListener('input', getInputValidateEventHandler('password', submitStep2, function(value) {
  return value.length >= 6;
}));

confirm.addEventListener('input', getInputValidateEventHandler('confirm', submitStep2, function(value) {
  return value === info.password;
}));

submitStep2.addEventListener('click', function(e) {
  e.preventDefault();
  // 넘어가기 전에도 validation 필요. 이벤트 발생하지 않을때가 있음. 인풋이벤트 말고 pubsub 같은 패턴으로 구현하는게 나은듯..?
  displayStepN(3);
});

// step3

let name = step3.querySelector('#name');
let phone = step3.querySelector('#phone');
let address = step3.querySelector('#address');
let homepage = step3.querySelector('#homepage');
let submitStep3 = step3.querySelector('.btn-primary');
let flagStep3 = {};

name.addEventListener('input', getInputValidateEventHandler('full name', submitStep3));

phone.addEventListener('input', getInputValidateEventHandler('phone number', submitStep3, function(value) {
  let phoneNumberPattern = /[0-9]{3}-[0-9]{3,4}-[0-9]{4}/;
  return phoneNumberPattern.test(value);
}));

address.addEventListener('input', getInputValidateEventHandler('address', submitStep3));

homepage.addEventListener('input', getInputValidateEventHandler('homepage url', submitStep3, function(value) {
  let homepageUrlPattern = /https*:\/\/.*/;
  return homepageUrlPattern.test(value);
}));

submitStep3.addEventListener('click', function(e) {
  e.preventDefault();
  step4.replaceChild(domify(_.template(step4Template)(info)), step4.children[0]);
  displayStepN(4);
});

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
  key = key.replace(/(\s)(\w)/, function(match, p1, p2){
    return p2.toUpperCase();
  });
  return function(e) {
    let testResult = validator ? validate(e.target.value, validator) : true;

    if (e.target.value === '') {
      switchClassInvalidOrNot(e.target);
      e.target.nextElementSibling.textContent = `please enter ${ key }`;
      flag[key] = false;
      deactivateButton(button);
    } else if (testResult) {
      switchClassInvalidOrNot(e.target, true);
      flag[key] = true;
      info[key] = e.target.value;
      console.log(info)
      activateButton(button, flag);
    } else {
      switchClassInvalidOrNot(e.target);
      e.target.nextElementSibling.textContent = `invalid ${ key }`;
      flag[key] = false;
      deactivateButton(button);
    }
  };
}


function displayStepN (n) {
  if (typeof n !== 'number') n = parseInt(n);

  let currentActiveTap = paginationNavigator.querySelector('.active');
  currentActiveTap.classList.remove('active');
  currentActiveTap.classList.add('disabled');

  let currentPageTap = paginationNavigator.querySelector(`.page-item:nth-child(${ n })`);

  currentPageTap.classList.remove('disabled');
  currentPageTap.classList.add('active');

  pageList.forEach((page, i) => {
    if (i === n - 1) {
      page.classList.remove('hidden');
    } else {
      page.classList.add('hidden');
    }
  });
}

displayStepN('1');

