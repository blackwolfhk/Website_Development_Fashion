// User profile page - change password
function initChangePassword() {
  let displayAreaElem = document.querySelector(".display-content");
  displayAreaElem.innerHTML = /*html*/ `
    <div class="change-password">
    <h1>Change Password</h1>
    <div id="changePassword">
    
    
    <form id="update-pw-form">
    <label><b>Existing password:</b></label><br>
    <input type="password" name="oldPassword" required><br>
    <label><b>New password:</b></label><br>
    <input type="password" name="newPassword" required><br>
    <label><b>Re-Enter new password:</b></label><br>
    <input type="password" name="rePassword" required><br>
    <input type="submit" value="Submit" class="change-pw-btn">
  </form>
    <div id="system-msg"></div>
    </div>
    </div>`;
  let passWordFormElem = document.querySelector("#update-pw-form");
  passWordFormElem.addEventListener("submit", changePassword);
}

async function changePassword(e) {
  e.preventDefault();
  let passWordFormElem = document.querySelector("#update-pw-form");
  let msg = document.querySelector("#system-msg");
  let userDataJson = await fetch("/me");
  let userData = (await userDataJson.json()).data;
  let userId = userData.id;
  let updateFormObj = {
    userId: userId,
    oldPassword: passWordFormElem.oldPassword.value,
    newPassword: passWordFormElem.newPassword.value,
  };
  if (passWordFormElem.rePassword.value != passWordFormElem.newPassword.value) {
    msg.classList.remove("success");
    msg.innerHTML = "New password and re-enter password unmatch!";
    return;
  }

  let res = await fetch(`/changePassword`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateFormObj),
  });
  if (res.ok) {
    msg.classList.add("success");
    msg.innerHTML = "Update Password sucess";
    passWordFormElem.reset();
  } else {
    msg.classList.remove("success");
    msg.innerHTML = "Update Password failed";
  }
}
