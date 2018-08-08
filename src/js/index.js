
import domify from 'domify';
import _ from 'lodash';
import step1Template from '../templates/step1.html';
import step4Template from '../templates/step4.html';


let root = document.querySelector('#root');

let step1 = root.querySelector('.step1');
let step2 = root.querySelector('.step2');
let step3 = root.querySelector('.step3');
let step4 = root.querySelector('.step4');

let paginationNavigator = document.querySelector('.pagination');

let pageList = [step1, step2, step3, step4];
let info = {};
// window.history.pushState({ name: 'step1' }, 'step1', '/steps/1');





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

  // let currentActiveButton = paginationNavigator.querySelector('.active');
  // currentActiveButton.classList.remove('active');
  // currentActiveButton.classList.add('disabled');

  // target.parentElement.classList.remove('disabled');
  // target.parentElement.classList.add('active');

  displayStepN(target.textContent);
});


// step1
let submit = step1.querySelector('.btn-primary');
let checkBox = step1.querySelector('.form-check-input');

checkBox.addEventListener('click', function(e) {
  if (checkBox.checked) activateElement(submit);
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
let errMsgList = step2.querySelectorAll('.invalid-feedback');
let flag = {
  email: false,
  password: false,
  confirm: false
};

if (email.value === '') {
  email.classList.add('is-invalid');
  errMsgList[0].textContent = 'Please enter your e-mail.';
}

email.addEventListener('input', function(e) {
  let emailPattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (emailPattern.test(e.target.value)) {
    if (email.className.includes('is-invalid')) email.classList.remove('is-invalid');
    flag.email = true;
    info.email = e.target.value;
    activateElement(submitStep2, flag);
  } else if (e.target.value === '') {
    if (!email.className.includes('is-invalid')) email.classList.add('is-invalid');
    errMsgList[0].textContent = 'Please enter your e-mail.';
    flag.email = false;
    deactivateElement(submitStep2);
  } else {
    if (!email.className.includes('is-invalid')) email.classList.add('is-invalid');
    errMsgList[0].textContent = 'invalid e-mail format.';
    falg.email = false;
    deactivateElement(submitStep2);
  }
});

let passwordOrigin;
let submitStep2 = step2.querySelector('.btn-primary');

password.addEventListener('input', function(e) {
  if (e.target.value === '') {
    if (!password.className.includes('is-invalid')) password.classList.add('is-invalid');
    errMsgList[1].textContent = 'Please enter your password.';
    flag.password = false;
    deactivateElement(submitStep2);
  } else if (e.target.value.length < 6) {
    if (!password.className.includes('is-invalid')) password.classList.add('is-invalid');
    errMsgList[1].textContent = 'Password must have a length 6 or above.';
    flag.password = false;
    deactivateElement(submitStep2);
  } else {
    if (password.className.includes('is-invalid')) password.classList.remove('is-invalid');
    passwordOrigin = e.target.value;
    flag.password = true;
    activateElement(submitStep2, flag);
  }
});

confirm.addEventListener('input', function(e) {
  if (e.target.value === passwordOrigin) {
    if (confirm.className.includes('is-invalid')) confirm.classList.remove('is-invalid');
    flag.confirm = true;
    info.password = passwordOrigin;
    activateElement(submitStep2, flag);
  } else {
    if (!confirm.className.includes('is-invalid')) confirm.classList.add('is-invalid');
    errMsgList[2].textContent = 'Password incorrect.';
    flag.confirm = false;
    deactivateElement(submitStep2);
  }
});



submitStep2.addEventListener('click', function(e) {
  e.preventDefault();
  displayStepN(3);
});

let name = step3.querySelector('#name');
let phone = step3.querySelector('#phone');
let address = step3.querySelector('#address');
let hompage = step3.querySelector('#homepage');
let submitStep3 = step3.querySelector('.btn-primary');
let flagStep3 = {};
let phoneNumberPattern = /[0-9]{3}-[0-9]{3,4}-[0-9]{4}/;
let homepageUrlPattern = /https*:\/\/.*/;

name.addEventListener('input', function(e) {
  if (e.target.value === '') {
    flagStep3.fullname = false;
    deactivateElement(submitStep3);
    if (!e.target.className.includes('is-invalid')) e.target.classList.add('is-invalid');
    e.target.nextElementSibling.textContent = 'Please enter your name.';
  } else {
    flagStep3.fullname = true;
    info.fullname = e.target.value;
    if (e.target.className.includes('is-invalid')) e.target.classList.remove('is-invalid');
    activateElement(submitStep3, flagStep3);
  }
});

phone.addEventListener('input', function(e) {
  if (e.target.value === '') {
    flagStep3.phone = false;
    deactivateElement(submitStep3);
    if (!e.target.className.includes('is-invalid')) e.target.classList.add('is-invalid');
    e.target.nextElementSibling.textContent = 'Please enter your phone number.';
  } else if (phoneNumberPattern.test(e.target.value)) {
    flagStep3.phone = true;
    info.phone = e.target.value;
    if (e.target.className.includes('is-invalid')) e.target.classList.remove('is-invalid');
    activateElement(submitStep3, flagStep3);
  } else {
    flagStep3.phone = false;
    deactivateElement(submitStep3);
    if (!e.target.className.includes('is-invalid')) e.target.classList.add('is-invalid');
    e.target.nextElementSibling.textContent = 'Please enter a valid phone number.';
  }
});

address.addEventListener('input', function(e) {
  if (e.target.value === '') {
    flagStep3.address = false;
    deactivateElement(submitStep3);
    if (!e.target.className.includes('is-invalid')) e.target.classList.add('is-invalid');
    e.target.nextElementSibling.textContent = 'Please enter your address.';
  } else {
    flagStep3.address = true;
    info.address = e.target.value;
    if (e.target.className.includes('is-invalid')) e.target.classList.remove('is-invalid');
    activateElement(submitStep3, flagStep3);
  }
});

hompage.addEventListener('input', function(e) {
  if (e.target.value === '') {
    flagStep3.homepage = false;
    deactivateElement(submitStep3);
    if (!e.target.className.includes('is-invalid')) e.target.classList.add('is-invalid');
    e.target.nextElementSibling.textContent = 'Please enter your homepage url.';
  } else if (homepageUrlPattern.test(e.target.value)) {
    flagStep3.homepage = true;
    info.homepage = e.target.value;
    if (e.target.className.includes('is-invalid')) e.target.classList.remove('is-invalid');
    activateElement(submitStep3, flagStep3);
  } else {
    flagStep3.homepage = false;
    deactivateElement(submitStep3);
    if (!e.target.className.includes('is-invalid')) e.target.classList.add('is-invalid');
    e.target.nextElementSibling.textContent = 'Please enter a valid homepage url.';
  }
});

submitStep3.addEventListener('click', function(e) {
  e.preventDefault();
  debugger;
  // var t = _.template(step4.innerHTML);
  var t = _.template(step4Template);
  var j = domify(t(info));
  step4.replaceChild(j, step4.children[0]);
  console.log(info);
  displayStepN(4);
});



function activateElement (el, flag) {
  if (flag) {
    if (!Object.values(flag).includes(false) && el.className.includes('disabled')) {
      el.classList.remove('disabled');
      el.classList.add('active');
    }
    // console.log(flag)
  } else {
    if (el.className.includes('disabled')) {
      el.classList.remove('disabled');
      el.classList.add('active');
    }
  }
}

function deactivateElement (el) {
  if (!el.className.includes('disabled')) {
    el.classList.add('disabled');
    el.classList.remove('active');
  }
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

