
// -------------- Animation for Scroll fn. ------------
function debounce(func, wait = 20 , immediate = true) {
    var timeout;
  
    return function () {
      var context = this;
      var args = arguments;
          
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
  
      var callNow = immediate && !timeout;
      
      clearTimeout(timeout);
  
      timeout = setTimeout(later, wait);
      
      if (callNow) func.apply(context, args);
    };
};


const imgsSlider = document.querySelectorAll(".animated") 
const checkSlider = () => {
    imgsSlider.forEach(image => {
        const slideInAt = (window.scrollY + window.innerHeight) - image.offsetHeight / 6;
        const imageBottom = image.offsetTop + image.offsetHeight;
        const isHalfShown = slideInAt > image.offsetTop;
        const isNotScrolledPast = window.scrollY < imageBottom;

        if (isHalfShown && isNotScrolledPast) {
            image.classList.add('active')
        } else {
            image.classList.remove('active')
        }
    })
}

window.addEventListener('scroll', debounce(checkSlider))


// --------------- FireBase -----------
var firebaseConfig = {
    apiKey: "AIzaSyBnhfTEk1sQCUCQ1bnwZ0hZJTk7DrVHtSM",
    authDomain: "dog-inn-contact-form.firebaseapp.com",
    databaseURL: "https://dog-inn-contact-form.firebaseio.com",
    projectId: "dog-inn-contact-form",
    storageBucket: "dog-inn-contact-form.appspot.com",
    messagingSenderId: "352317954400",
    appId: "1:352317954400:web:6ddc858a207d3c3e2d6605",
    measurementId: "G-RY4JNK00NN"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();



// -------------- Contact Form ------------
// reference message collection
const form = document.querySelector('form');
const name = document.querySelector('#name');
const email = document.querySelector('#email');
const phone = document.querySelector('#number');
const message = document.querySelector('#message');
const send = document.querySelector('#send');
const alert = document.querySelector('.alert');

// reference mssages collection
var messagesRef = firebase.database().ref('messages');

// get form values
const getInputValue = (id) => {
  return document.querySelector(id).value;
}

// save message to firebase
function saveMessage(name, email, phone, message) {
    let newMessageRef = messagesRef.push();
    newMessageRef.set({
      nameVal: name,
      emailVal: email,
      phoneVal: phone,
      messageVal: message
    })
}
  
const getCapitalName = (input) => {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}
  
const isValidEmail = (input) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(input.value)) {
      return false;
    }
    return true;
}

// show success fuction 
const showSuccess = () => {
    alert.style.display = 'block';
  
    // hide alert after 3s
    setTimeout(function () {
      document.querySelector('.alert').style.display = 'none';
    }, 3000);
}

// Hide error messages
const hideError = (input) => {
    input.parentElement.classList.remove('form-group');
    input.parentElement.querySelector('small').textContent = '';
}

// show error function - color, message
const showError = (input, message) => {
    input.parentElement.className = 'form-group error';
    input.parentElement.querySelector('small').textContent = message;
  }

// form validation
const checkRequired = (inputArr) => {
    let areAllFilled = true;
    inputArr.forEach(input => {
      if (!areAllFilled) {
        return;
      } else if (input.value === '' || ((input === email) && !isValidEmail(email))) {
        areAllFilled = false;
      }
    })
  
    if (!areAllFilled) { // if any of the fields is left empty
      inputArr.forEach(input => {
        if (input.value === '') {
          showError(input, `${getCapitalName(input)} is required`);
        } else if (input === email && !isValidEmail(email)) { //if invalid email
          showError(input, `Enter valid ${input.id} address`);
        } else {
          hideError(input);
        }
      })
  
    } else { //if all fields are filled correctly
      inputArr.forEach(input => {
        hideError(input);
      })
      showSuccess();
      form.reset();
    }
  }
  
  const submitForm = (e) => {
    e.preventDefault();
    // form validation
    checkRequired([name, email, message]);
  
    // get values of each input
    const nameVal = getInputValue('#name');
    const emailVal = getInputValue('#email');
    const phoneVal = getInputValue('#number');
    const messageVal = getInputValue('#message');
  
    saveMessage(nameVal, emailVal, phoneVal, messageVal);
  }
  
  // event-listener for submit
  form.addEventListener('submit', submitForm);  