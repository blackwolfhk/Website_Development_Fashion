window.onload = initSignupPage;

async function initSignupPage() {
  // console.log("open page testing only")
  let signupFormElem = document.querySelector("#register-form");
  let signupResultElem = document.querySelector("#signup-result");
  if (signupFormElem) {
    signupFormElem.addEventListener("submit", register);
  }
}

async function register(e) {
  // console.log("register start")
  e.preventDefault();
  let signupFormElem = e.target;
  let signupResultElem = document.querySelector("#signup-result");
  let signupFormObj = {
    username: signupFormElem.username.value,
    password: signupFormElem.password.value,
    rePassword: signupFormElem.rePassword.value,
    email: signupFormElem.email.value,
    address: signupFormElem.address.value,
    mobile: signupFormElem.mobile.value,
  };

  // Validation:
  if (signupFormObj.username.length >= 10) {
    signupResultElem.classList.add("error");
    signupResultElem.innerText = "user name must be less than 10 characters.";
    return;
  }

  if (signupFormObj.password !== signupFormObj.rePassword) {
    signupResultElem.classList.add("error");
    signupResultElem.innerText = "password and rePassword is not munch.";
    return;
  }

  console.log("mobile:", signupFormObj.mobile);
  console.log("type", isNaN(signupFormObj.mobile));

  if (signupFormObj.mobile.length < 8 || isNaN(signupFormObj.mobile)) {
    signupResultElem.classList.add("error");
    signupResultElem.innerText = "Please enter valid mobile number.";
    return;
  }

  // Fetch
  let res = await fetch("/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(signupFormObj),
  });

  // After fetch handling
  let result = await res.json();

  signupResultElem.innerText = result.message;
  if (res.ok) {
    // success handling
    signupResultElem.classList.add("success");
    window.location = "/index.html";
  } else {
    // failure handling
    signupResultElem.classList.add("error");
    signupResultElem.innerText = result.error;
  }
}