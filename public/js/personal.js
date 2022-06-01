// User profile page - personal profile
function initPersonalDetails() {
  let displayAreaElem = document.querySelector(".display-content");
  displayAreaElem.innerHTML = /*html*/ `
  <div class="personal-profile">
  <h1>Personal Details</h1>
<div id="personalDetails"></div>
  </div>`;
  getPersonalDetails();
}

async function getPersonalDetails() {
  let userDataJson = await fetch("/me");
  let userData = (await userDataJson.json()).data;
  let userId = userData.id;
  let personalJSON = await fetch(`/personalDetails/${userId}`)
  let personal = (await personalJSON.json()).personalDetails[0];
  let personalDetailsElem = document.querySelector("#personalDetails");
  personalDetailsElem.innerHTML += /*HTML*/ `
    <div class = "login-details" >
    <div class = "login-area">
    <div id = "username" > <b>User name:</b> ${personal.username} </div> 
    <br>
    <div id = "login-email" > <b>Login email:</b> ${personal.email} </div> 
    <br>
    <div id = "mobile" > <b>Mobile number:</b> ${personal.mobile_no} </div> 
    <br>
    <div id = "address" > <b>Address:</b> ${personal.address} </div> 
    <span > (Also the same as delivery address) </span>
    </div>
    </div>
    `
}