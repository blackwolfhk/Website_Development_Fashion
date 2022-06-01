// To remember login status from users
window.onload = getMe;
let isLogin = false;

async function getMe() {
  const res = await fetch("/me");
  const result = await res.json();
  // console.log(res.ok)
  if (res.ok) {
    isLogin = true;
  } else {
    isLogin = false;
  }
  displayUserOptions();

  // console.log(isLogin)
  return result.data;
}

function loginGuard() {
  setTimeout(() => {
    if (!isLogin) {
      window.location.href = "/index.html";
    }
  }, 1000);
}
