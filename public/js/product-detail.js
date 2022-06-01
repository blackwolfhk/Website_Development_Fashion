window.load = (async () => {
  let pid = getProductIdInQuery();
  await fetchProductById(pid);
})();

async function fetchProductById(pid) {
  let productImgElem = document.querySelector("#product-img");
  let productInfoElem = document.querySelector("#product-session");
  let productRes = await fetch(`/products/${pid}`);
  let product = (await productRes.json()).data;
  let availableProductsRes = await fetch(`/check-products/${pid}`);
  let availableProducts = (await availableProductsRes.json()).data;
  let productImgHTML = /*HTML*/ `   
      <img src=${product.image} alt="product image" />
    `;
  let productInfoHTML = /*HTML*/ `
  <div class="product-name">
  ${product.name}
  <hr />
</div>
<div class="product-description">
  <p>Description:</p>
  <p>
    ${product.description}
  </p>
  <hr />
</div>
<form>
<input type = "hidden" name = "productId" value = "${pid}" />
<div class="product-options">
  <div class="product-size">
    Product Size:
    <select name="size" id="size">
    <option value="0" >Please Select Size</option>
    </select>
  </div>
  <div class="product-type"id="product-type">Type: ${product.generation}-${product.type}</div>
  <div class="product-type"id="product-type">Unit Price: $${product.unit_price}HKD</div>
</div>
</div>
<div class="add-cart-session d-flex">
<button class="add-cart-btn" onclick="addLocalCart()" type="button">Add To Cart</button>
</div>
</form>`;
  productImgElem.innerHTML += productImgHTML;
  productInfoElem.innerHTML += productInfoHTML;
  let sizeInfoElem = document.querySelector("#size");
  for (let availableProduct of availableProducts) {
    let sizeInfoHTML = /*HTML*/ `
  <option value="${availableProduct.product_id}" >${availableProduct.size}</option>
  `;
    sizeInfoElem.innerHTML += sizeInfoHTML;
  }
}

function getProductIdInQuery() {
  let search = new URLSearchParams(window.location.search);
  return search.get("productId");
}

async function addLocalCart() {
  if (isLogin) {
    await setDBCartItemsToLocal();
  }
  let sizeOptions = document.querySelector("#size");
  let selectedProductId = sizeOptions.options[sizeOptions.selectedIndex].value;
  let hasItem = false;
  if (selectedProductId === "0") {
    alert("Please select Size");
    return;
  }
  let cartItems = localStorage.getItem("shoppingCart");
  let newCartItem = {
    productId: selectedProductId,
    qty: 1,
  };

  if (!cartItems) {
    localStorage.setItem("shoppingCart", "[]");
    cartItems = localStorage.getItem("shoppingCart");
  }
  cartItems = JSON.parse(cartItems);

  if (cartItems.length > 0) {
    for (let cartItem of cartItems) {
      if (cartItem.productId == newCartItem.productId) {
        hasItem = true;
      }
    }
  }
  if (!hasItem) {
    cartItems.push(newCartItem);
  }
  localStorage.setItem("shoppingCart", JSON.stringify(cartItems));

  if (isLogin) {
    let userDataJSON = await fetch("/me");
    let userData = (await userDataJSON.json()).data;
    let userId = userData.id;

    await fetch("/shopping-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartItems: cartItems, userId: userId }),
    });
  }

  displayCart();
  showDrawer();
}
