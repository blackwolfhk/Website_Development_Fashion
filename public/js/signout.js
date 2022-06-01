async function homeLogout() {
  // console.log("homeLogout")

  // Fetch
  let res = await fetch("/signout", {
    method: "POST",
  });

  // After fetch handling
  if (res.ok) {
    // success handling
    isLogin = false;
    displayUserOptions();
  } else {
    // error handling
    console.log("error");
  }
  localStorage.clear();
  loginGuard();
}
