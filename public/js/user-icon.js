let drawerIcons = document.querySelectorAll(".drawer-icons");
let screenBackground = document.querySelector(".user-drawer-background");
let drawer = document.querySelector(".user-drawer");
let drawerContent = document.querySelector(".drawer-content");
let body = document.querySelector("body");
let searchIcon = document.querySelector(".search-icon");
let cartIcon = document.querySelector(".cart-icon");
let loginIcon = document.querySelector(".login-icon");
let logoutIcon = document.querySelector(".logout-icon");
let profileIcon = document.querySelector(".profile-icon");

initIcons();
initDrawerFunc();
displayUserOptions();

function initDrawerFunc() {
  for (let drawerIcon of drawerIcons) {
    drawerIcon.addEventListener("click", () => {
      showDrawer();
    });
  }
}

function initIcons() {
  searchIcon.addEventListener("click", () => {
    drawerContent.innerHTML = /*html*/ `
    <div class="search-content">
    <h1>Search</h1>
    <form>
      <div class="search-session d-flex">
        <div class="search-box">
          <input type="text" placeholder="Product Name - (e.g air-jordan)" name="productName" id="searchText" />
        </div>
        <div>
          <i class="bi bi-search" onclick="searchProductName()"></i>
        </div>
      </div>
    </form>
  </div>`;
  });
  // loginIcon.addEventListener("click", () => {
  //   drawerContent.innerHTML = /*html*/ `
  //   <div class="login-content">
  //   <form id="login-form">
  //     <h1>Sign In</h1>
  //     <div class="input-box">
  //       <input name="email"type="email" placeholder="Email" />
  //     </div>
  //     <div class="input-box">
  //       <input name="password"type="password" placeholder="password" />
  //     </div>
  //     <div class="password-hints d-flex">
  //       <div>6-25characters</div>
  //       <div><a href="12-forgot-pw.html">forgot password?</a></div>
  //     </div>

  //     <button class="signin-here-btn btn btn-primary"> Sign in</button>
  //     <div name="signinResult"></div>

  //     <div class="google-login-position">
  //     <a href="/connect/google" class="login-with-google-btn" >
  //     Sign in with Google
  //     </a>
  //     </div>

  //     <div class="loginMessage"></div>

  //   <br>
  //   </form>

  //   <div class="create-account-section">
  //     <p>
  //       Need an online account? <br /><br />Create one now if you're a new
  //       customer
  //     </p>
  //     <a href="13-create-account.html" class="btn btn-primary">Create Account</a>
  //   </div>
  // </div>`;

  //   // signin handling
  //   let form = document.querySelector("#login-form");
  //   form.addEventListener("submit", login);
  // });

  loginIcon.addEventListener("click", displayLoginContent);

  cartIcon.addEventListener("click", displayCart);
}

function showDrawer() {
  screenBackground.classList.add("drawer-active");
  drawer.classList.remove("slide-drawer-right");
  drawer.classList.add("slide-drawer-left");
  body.classList.add("stop-scroll");
}

function hideDrawer() {
  setTimeout(() => {
    screenBackground.classList.remove("drawer-active");
  }, 900);
  drawer.classList.remove("slide-drawer-left");
  drawer.classList.add("slide-drawer-right");
  setTimeout(() => {
    drawer.classList.remove("slide-drawer-right");
    body.classList.remove("stop-scroll");
  }, 1000);
}

function displayUserOptions() {
  if (isLogin) {
    loginIcon.classList.add("inactive-icon");
    // cartIcon.classList.remove("inactive-icon");
    profileIcon.classList.remove("inactive-icon");
    logoutIcon.classList.remove("inactive-icon");
  } else {
    loginIcon.classList.remove("inactive-icon");
    // cartIcon.classList.add("inactive-icon");
    profileIcon.classList.add("inactive-icon");
    logoutIcon.classList.add("inactive-icon");
  }
}

async function displayCart() {
  if (isLogin) {
    await mergeDBCartAndLocal();
  }
  initCart();
  // // setTimeout(initCart, );

  // let totalPrice = 0;
  // let isOutOfStock = false;
  // drawerContent.innerHTML = /*html*/ `
  // <form id="checkout-form">
  // <div class="cart-content d-flex">
  //   <div class="cart-header">Your shopping cart has <span id="numOfItems">0</span> items</div>
  //   <div class="cart-list">
  //   </div>

  //   <div class="check-out-section">
  //     <div class="cart-subtotal d-flex">
  //       <div>SUBTOTAL</div>
  //       <div id="cart-total-amt"></div>
  //     </div>
  //     <div class="error-msg" id="check-out-msg"></div>
  //     <div class="cart-checkout d-flex">
  //       <button type="button"id="checkout-btn"onclick="checkout()">Go Checkout</button>
  //     </div>
  //   </div>
  // </div>
  // </form>
  //   `;
  // let shoppingCartJSON = localStorage.getItem("shoppingCart");
  // if (!shoppingCartJSON) {
  //   return;
  // }
  // let shoppingCart = JSON.parse(shoppingCartJSON);
  // let numberOfItems = shoppingCart.length;
  // if (numberOfItems === 0) {
  //   return;
  // }
  // document.querySelector("#numOfItems").innerText = numberOfItems;
  // let queryStr = "?";
  // for (let item of shoppingCart) {
  //   queryStr += `productId=${item.productId}&qty=${item.qty}&`;
  // }
  // queryStr = queryStr.slice(0, -1);
  // let res = await fetch(`/shopping-cart/${numberOfItems}${queryStr}`);
  // let cartItems = (await res.json(res)).cartItems;

  // let cartListElem = document.querySelector(".cart-list");
  // cartListElem.innerHTML = "";
  // for (let cartItem of cartItems) {
  //   cartListElem.innerHTML += /*HTML*/ `
  // <div class="cart-item d-flex" >
  //   <div class="item-img-container" id="${cartItem.itemDetails[0].product_id}">
  //     <div class="item-img">
  //       <img src="${cartItem.itemDetails[0].image}" alt="item img" />
  //     </div>
  //   </div>
  //   <div class="item-details" id="pid${cartItem.itemDetails[0].product_id}-detail">
  //     <div class="item-title">${cartItem.itemDetails[0].name}</div>
  //     <div class="item-info">Type:${cartItem.itemDetails[0].product_generation} ${cartItem.itemDetails[0].product_type} </div>
  //     <div class="item-info">Size:${cartItem.itemDetails[0].size}</div>
  //     <div class="item-info">Unit Price:$${cartItem.itemDetails[0].unit_price}</div>
  //   </div>
  //   <div>
  //     <i class="bi bi-x remove-item-btn" onclick="deleteCartItem(${cartItem.itemDetails[0].product_id})"></i>
  //   </div>
  // </div>`;
  //   let itemDetailsElem = document.querySelector(
  //     `#pid${cartItem.itemDetails[0].product_id}-detail`
  //   );
  //   if (
  //     Number(cartItem.itemDetails[0].stock_level) > Number(cartItem.requiredQty)
  //   ) {
  //     itemDetailsElem.innerHTML += /*HTML*/ `
  //     <div class="item-info">Qty:
  //       <select name="qty" id="cart-product${cartItem.itemDetails[0].product_id}-qty" onchange="updateCart(${cartItem.itemDetails[0].product_id})">
  //         <option value="1">1</option>
  //         <option value="2">2</option>
  //         <option value="3">3</option>
  //         <option value="4">4</option>
  //         <option value="5">5</option>
  //         <option value="6">6</option>
  //         <option value="7">7</option>
  //         <option value="8">8</option>
  //         <option value="9">9</option>
  //         <option value="10">10</option>
  //       </select>
  //     </div>
  //     `;
  //     totalPrice +=
  //       Number(cartItem.requiredQty) *
  //       Number(cartItem.itemDetails[0].unit_price);
  //   } else {
  //     isOutOfStock = true;
  //     itemDetailsElem.innerHTML += /*HTML*/ `<div class="item-info">Qty:
  //     <select name="qty" id="cart-product${cartItem.itemDetails[0].product_id}-qty" onchange="updateCart(${cartItem.itemDetails[0].product_id})">
  //       <option value="1">1</option>
  //       <option value="2">2</option>
  //       <option value="3">3</option>
  //       <option value="4">4</option>
  //       <option value="5">5</option>
  //       <option value="6">6</option>
  //       <option value="7">7</option>
  //       <option value="8">8</option>
  //       <option value="9">9</option>
  //       <option value="10">10</option>
  //     </select>
  //   <span class="error-msg">(Out of Stock)</span></div>`;
  //   }

  //   setTimeout(() => {
  //     document.querySelector(
  //       `#cart-product${cartItem.itemDetails[0].product_id}-qty`
  //     ).value = `${cartItem.requiredQty}`;
  //   }, 0);

  //   let QtyOptions = document.querySelector("#product-qty");
  //   let selectedQty = QtyOptions.options[QtyOptions.selectedIndex].value;

  //   let totalAmtElem = document.querySelector("#cart-total-amt");
  //   let checkOutMsgElem = document.querySelector("#check-out-msg");
  //   let checkoutBtn = document.querySelector("#checkout-btn");
  //   totalAmtElem.innerText = `$${totalPrice}HKD`;
  //   if (isOutOfStock) {
  //     checkOutMsgElem.innerText =
  //       "Some products is out of stock.Please check before checkout";
  //     checkoutBtn.disabled = true;
  //   }
  // }
}

function displayLoginContent() {
  drawerContent.innerHTML = /*html*/ ` 
  <div class="login-content">
  <form id="login-form">
    <h1>Sign In</h1>
    <div class="input-box">
      <input name="email"type="email" placeholder="Email" />
    </div>
    <div class="input-box">
      <input name="password"type="password" placeholder="password" />
    </div>
    <div class="password-hints d-flex">
      <div>6-25characters</div>
      <div><a href="12-forgot-pw.html">forgot password?</a></div>
    </div>
    <button class="signin-here-btn btn btn-primary"> Sign in</button>
    <div name="signinResult"></div>
    <div class="google-login-position">
    <a href="/connect/google" class="login-with-google-btn" >
    Sign in with Google
    </a>
    </div>
    <div class="loginMessage"></div>
  <br>
  </form>
  <div class="create-account-section">
    <p>
      Need an online account? <br /><br />Create one now if you're a new
      customer
    </p>
    <a href="13-create-account.html" class="btn btn-primary">Create Account</a>
  </div>
</div>`;
  // signin handling
  let form = document.querySelector("#login-form");
  form.addEventListener("submit", login);
}

async function checkout() {
  if (!isLogin) {
    let checkOutMsgElem = document.querySelector("#check-out-msg");
    checkOutMsgElem.innerText = "Please login before checkout";
    setTimeout(displayLoginContent, 2000);
    return;
  }
  let userDataJSON = await fetch("/me");
  let userData = (await userDataJSON.json()).data;
  let userId = userData.id;
  let shoppingCartJSON = localStorage.getItem("shoppingCart");
  let shoppingCart = JSON.parse(shoppingCartJSON);
  let orderRef = "";
  let totalAmt = document.querySelector("#cart-total-amt").innerText;
  totalAmt = totalAmt.slice(1, -3);
  totalAmt = Number(totalAmt);
  for (let i = 0; i < 6; i++) {
    orderRef += Math.floor(Math.random() * 10).toString();
  }
  let res = await fetch("/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cartItems: shoppingCart,
      userId: userId,
      orderRef: orderRef,
      totalAmt: totalAmt,
    }),
  });
  localStorage.clear();
  await fetch("/shopping-cart", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
    }),
  });
  let orderData = (await res.json()).data;
  drawerContent.innerHTML = /*HTML*/ `

  <div class="order-content ">
  <div class="order-detail">
      <div class="order-header">
        <div class="order-msg">Thank You</div>
        <div class="order-msg">Your Order Ref is:</div>
        <div class="order-ref">${orderData.orderRef}</div>
      </div>
      <div class="confirm-msg"> An confirmation email will be sent to your personal email</div>
      <div class=" d-flex">
        <button type="button"id="order-btn"onclick="hideDrawer()">Buy More</button>
      </div>
    </div>
  </div>
  `;
}

function deleteCartItem(pid) {
  let shoppingCartJSON = localStorage.getItem("shoppingCart");
  let shoppingCart = JSON.parse(shoppingCartJSON);
  shoppingCart = shoppingCart.filter((item) => {
    return item.productId != pid;
  });
  localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  if (isLogin) {
    updateDBCart();
  }
  displayCart();
}

async function updateCart(pid) {
  let selectedOption = document.querySelector(`#cart-product${pid}-qty`);
  let selectedQty = selectedOption.options[selectedOption.selectedIndex].value;
  let shoppingCartJSON = localStorage.getItem("shoppingCart");
  let shoppingCart = JSON.parse(shoppingCartJSON);
  for (let item of shoppingCart) {
    if (item.productId == pid) {
      item.qty = selectedQty;
    }
  }
  localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  if (isLogin) {
    updateDBCart();
  }
  displayCart();
}

async function setDBCartItemsToLocal() {
  let userDataJSON = await fetch("/me");
  let userData = (await userDataJSON.json()).data;
  let userId = userData.id;
  let dbCartJSON = await fetch(`/get-cart/${userId}`);
  let dbCart = (await dbCartJSON.json()).shoppingCart;
  let tempCart = [];
  for (let item of dbCart) {
    tempCart.push({
      productId: item.product_id,
      qty: item.quantity,
    });
  }
  localStorage.setItem("shoppingCart", JSON.stringify(tempCart));
}

async function mergeDBCartAndLocal() {
  let userDataJSON = await fetch("/me");
  let userData = (await userDataJSON.json()).data;
  let userId = userData.id;
  let dbCartJSON = await fetch(`/get-cart/${userId}`);
  let dbCart = (await dbCartJSON.json()).shoppingCart;
  let shoppingCartJSON = localStorage.getItem("shoppingCart");
  let shoppingCart = JSON.parse(shoppingCartJSON);
  let tempCart = [];
  for (let item of dbCart) {
    tempCart.push({
      productId: item.product_id,
      qty: item.quantity,
    });
  }
  if (shoppingCart) {
    for (let localItem of shoppingCart) {
      let hasDuplicate = false;
      for (let item of tempCart) {
        if (localItem.productId == item.productId) {
          item.qty = localItem.qty;
          hasDuplicate = true;
        }
      }
      if (!hasDuplicate) {
        tempCart.push({
          productId: localItem.productId,
          qty: localItem.qty,
        });
      }
    }
  }
  localStorage.setItem("shoppingCart", JSON.stringify(tempCart));
  updateDBCart();
}

async function initCart() {
  let totalPrice = 0;
  let isOutOfStock = false;
  drawerContent.innerHTML = /*html*/ `
  <form id="checkout-form">
  <div class="cart-content d-flex">
    <div class="cart-header">Your shopping cart has <span id="numOfItems">0</span> items</div>
    <div class="cart-list">
    </div>
  
    <div class="check-out-section">
      <div class="cart-subtotal d-flex">
        <div>SUBTOTAL</div>
        <div id="cart-total-amt"></div>
      </div>
      <div class="error-msg" id="check-out-msg"></div>
      <div class="cart-checkout d-flex">
        <button type="button"id="checkout-btn"onclick="checkout()">Go Checkout</button>
      </div>
    </div>  
  </div>
  </form>
    `;
  let shoppingCartJSON = localStorage.getItem("shoppingCart");
  if (!shoppingCartJSON) {
    return;
  }
  let shoppingCart = JSON.parse(shoppingCartJSON);
  let numberOfItems = shoppingCart.length;
  if (numberOfItems === 0) {
    return;
  }
  document.querySelector("#numOfItems").innerText = numberOfItems;
  let queryStr = "?";
  for (let item of shoppingCart) {
    queryStr += `productId=${item.productId}&qty=${item.qty}&`;
  }
  queryStr = queryStr.slice(0, -1);
  let res = await fetch(`/shopping-cart/${numberOfItems}${queryStr}`);
  let cartItems = (await res.json(res)).cartItems;

  let cartListElem = document.querySelector(".cart-list");
  cartListElem.innerHTML = "";
  for (let cartItem of cartItems) {
    cartListElem.innerHTML += /*HTML*/ `
  <div class="cart-item d-flex" >
    <div class="item-img-container" id="${cartItem.itemDetails[0].product_id}">
      <div class="item-img">
        <img src="${cartItem.itemDetails[0].image}" alt="item img" />
      </div>
    </div>
    <div class="item-details" id="pid${cartItem.itemDetails[0].product_id}-detail">
      <div class="item-title">${cartItem.itemDetails[0].name}</div>
      <div class="item-info">Type:${cartItem.itemDetails[0].product_generation} ${cartItem.itemDetails[0].product_type} </div>
      <div class="item-info">Size:${cartItem.itemDetails[0].size}</div>
      <div class="item-info">Unit Price:$${cartItem.itemDetails[0].unit_price}</div>
    </div>
    <div>
      <i class="bi bi-x remove-item-btn" onclick="deleteCartItem(${cartItem.itemDetails[0].product_id})"></i>
    </div>
  </div>`;
    let itemDetailsElem = document.querySelector(
      `#pid${cartItem.itemDetails[0].product_id}-detail`
    );
    if (
      Number(cartItem.itemDetails[0].stock_level) > Number(cartItem.requiredQty)
    ) {
      itemDetailsElem.innerHTML += /*HTML*/ `
      <div class="item-info">Qty:
        <select name="qty" id="cart-product${cartItem.itemDetails[0].product_id}-qty" onchange="updateCart(${cartItem.itemDetails[0].product_id})">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>
      `;
      totalPrice +=
        Number(cartItem.requiredQty) *
        Number(cartItem.itemDetails[0].unit_price);
    } else {
      isOutOfStock = true;
      itemDetailsElem.innerHTML += /*HTML*/ `<div class="item-info">Qty:
      <select name="qty" id="cart-product${cartItem.itemDetails[0].product_id}-qty" onchange="updateCart(${cartItem.itemDetails[0].product_id})">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
    <span class="error-msg">(Out of Stock)</span></div>`;
    }

    setTimeout(() => {
      document.querySelector(
        `#cart-product${cartItem.itemDetails[0].product_id}-qty`
      ).value = `${cartItem.requiredQty}`;
    }, 0);
  }
  let totalAmtElem = document.querySelector("#cart-total-amt");
  let checkOutMsgElem = document.querySelector("#check-out-msg");
  let checkoutBtn = document.querySelector("#checkout-btn");
  totalAmtElem.innerText = `$${totalPrice}HKD`;
  if (isOutOfStock) {
    checkOutMsgElem.innerText =
      "Some products is out of stock.Please check before checkout";
    checkoutBtn.disabled = true;
  }
}

async function updateDBCart() {
  let cartItems = localStorage.getItem("shoppingCart");
  cartItems = JSON.parse(cartItems);
  let userDataJSON = await fetch("/me");
  let userData = (await userDataJSON.json()).data;
  let userId = userData.id;
  await fetch("/shopping-cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cartItems: cartItems,
      userId: userId,
    }),
  });
}

// Search
function searchProductName() {
  let searchText = document.querySelector("#searchText").value;
  let params = window.location.search
  let url = new URL(window.location.href);
  url.pathname = '03-product.html'
  url.searchParams.set('productName', searchText);
  // console.log(url)
  window.location.href = url.href
}