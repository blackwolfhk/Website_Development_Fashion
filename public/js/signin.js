// window.onload = initSigninPage;
// window.onload = login;

// Create account page - Sign in button handling
async function initSigninPage() {
  let signinHereBtnElem = document.querySelector(".signin-here-btn");

  signinHereBtnElem.addEventListener("click", () => {
    console.log("signin testing here");
  });
}

// Right sidebar sign in handling
async function login(e) {
  e.preventDefault();
  let form = e.target;
  let email = form.email.value;
  let password = form.password.value;

  // console.log("email : ", email)
  // console.log("password : ", password)

  if (!email || !password) {
    return;
  }

  let signinFormObj = {
    email: email,
    password: password,
  };
  // console.log(signinFormObj)

  // Fetch
  try {
    let res = await fetch("/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signinFormObj),
    });

    const result = await res.json();
    // After fetch handling
    if (res.ok) {
      // success handling
      isLogin = true;
      displayUserOptions();
      hideDrawer();
    } else {
      // error handling
      const msg = result.error;
      let loginMessage = document.querySelector(".loginMessage");
      loginMessage.innerHTML = `${msg}`; // print on the signin right bar
      console.log("error : ", msg);
    }
  } catch {
    console.log("invalid input");
  }
}
