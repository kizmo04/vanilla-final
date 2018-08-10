
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

paginationContainer.parentElement.replaceChild(domify(_.template(paginationTemplate)()), paginationContainer);

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


// let step1 = root.querySelector('.step1');
// let step2 = root.querySelector('.step2');
// let step3 = root.querySelector('.step3');
// let step4 = root.querySelector('.step4');


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

var flag = {};
// window.history.pushState({ name: 'step1' }, 'step1', '/steps/1');

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

// step1
// let submit = contentContainer.querySelector('.btn-primary');
// let checkBox = contentContainer.querySelector('.form-check-input');
// let email;
// let password;
// let confirm;

// checkBox.addEventListener('click', function(e) {
//   if (checkBox.checked) activateButton(submit);
// });

// submit.addEventListener('click', function(e) {
//   e.preventDefault();
//   if (checkBox.checked) {
//     info.policyAgreed = true;
//     displayStepN(2);
//     password = contentContainer.querySelector('#password');
//     email = contentContainer.querySelector('#email');
//     confirm = contentContainer.querySelector('#confirm');
//   } else {
//     info.policyAgreed = false;
//     console.log('약관에 동의해주세요');
//   }
// });


// step2
// let name;
// let phone;
// let address;
// let homepage;


// if (email.value === '') {
//   email.classList.add('is-invalid');
//   email.nextElementSibling.textContent = 'Please enter your e-mail.';
// }



// email.addEventListener('input', getInputValidateEventHandler('email', submit, function(value) {
//   let emailPattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

//   return emailPattern.test(value);
// }));

// password.addEventListener('input', getInputValidateEventHandler('password', submit, function(value) {
//   return value.length >= 6;
// }));

// confirm.addEventListener('input', getInputValidateEventHandler('confirm', submit, function(value) {
//   return value === info.password;
// }));

// submit.addEventListener('click', function(e) {
//   e.preventDefault();
//   // 넘어가기 전에도 validation 필요. 이벤트 발생하지 않을때가 있음. 인풋이벤트 말고 pubsub 같은 패턴으로 구현하는게 나은듯..?
//   displayStepN(3);
//   name = contentContainer.querySelector('#full-name');
//   phone = contentContainer.querySelector('#phone');
//   address = contentContainer.querySelector('#address');
//   homepage = contentContainer.querySelector('#homepage-url');
// });

// step3

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
    let homepageUrlPattern = /https*:\/\/.*/;
    return homepageUrlPattern.test(value);
  }
}



// name.addEventListener('input', getInputValidateEventHandler('full name', submit));

// phone.addEventListener('input', getInputValidateEventHandler('phone number', submit, function(value) {
//   let phoneNumberPattern = /[0-9]{3}-[0-9]{3,4}-[0-9]{4}/;
//   return phoneNumberPattern.test(value);
// }));

// address.addEventListener('input', getInputValidateEventHandler('address', submit));

// homepage.addEventListener('input', getInputValidateEventHandler('homepage url', submit, function(value) {
//   let homepageUrlPattern = /https*:\/\/.*/;
//   return homepageUrlPattern.test(value);
// }));

// submit.addEventListener('click', function(e) {
//   e.preventDefault();
//   // step4.replaceChild(domify(_.template(step4Template)(info)), step4.children[0]);
//   displayStepN(4, info);
// });

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

  // flag[key] = false;
  // info[key] = null;
  return function(e) {
    let testResult = validator ? validate(e.target.value, validator) : true;
    info[key] = e.target.value;
    if (e.target.value === '') {
      switchClassInvalidOrNot(e.target);
      e.target.nextElementSibling.textContent = `please enter ${ key }`;
      flag[key] = false;
      deactivateButton(button);
    } else if (testResult) {
      switchClassInvalidOrNot(e.target, true);
      flag[key] = true;
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

  // let currentActiveTap = paginationNavigator.querySelector('.active');
  // currentActiveTap.classList.remove('active');
  // currentActiveTap.classList.add('disabled');

  // let currentPageTap = paginationNavigator.querySelector(`.page-item:nth-child(${ n })`);

  // currentPageTap.classList.remove('disabled');
  // currentPageTap.classList.add('active');

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
    // window.history.pushState({ name: `step${ n }` }, `step${ n }`, `/steps/${ n }`);
    // state에 value 담아주기
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
      if (!flag[key] && !Array.prototype.includes.call(submitButton.classList, 'disabled')) {
        submitButton.classList.add('disabled');
      } else {
        submitButton.classList.remove('disabled');
      }
    });
  }
}


