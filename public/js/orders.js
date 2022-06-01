function initOrderHistory() {
  let displayAreaElem = document.querySelector(".display-content");
  displayAreaElem.innerHTML = /*html*/ `
  <div class="order-history-content">
    <div class="order-history-table">
          <div class="order-table-format">
            <h1>Order History</h1>
            <table id="tbOrderHistory" class="table border ps-table w-100 mb-3">

            </table>
          </div>
       </div>
    <div class="order-page"></div>
  </div>`;
  getOrderHistory(1);
}

async function getOrderHistory(pageNo) {
  let userDataJSON = await fetch("/me");
  let userData = (await userDataJSON.json()).data;
  let userId = userData.id;
  let dataJSON = await fetch(`/orderHistory/${userId}?page=${pageNo}`);
  let data = await dataJSON.json();
  let orders = data.orders;
  let totalOrderNo = data.totalOrder;
  let table = document.querySelector("#tbOrderHistory");
  table.innerHTML = /*html*/ `              
  <tr>
  <th class="font-weight-bold py-2 border-0 quantity">
    Order Reference
  </th>
  <th class="font-weight-bold py-2 border-0">Order Status</th>
  <th class="font-weight-bold py-2 border-0">Purchase Date</th>
  <th class="font-weight-bold py-2 border-0">Delivery Date</th>
  <th class="font-weight-bold py-2 border-0">Total</th>
</tr>`;
  for (let i = 0; i < orders.length; i++) {
    table.innerHTML += /*HTML*/ `
    <tr>
    <td><span id="order-${orders[i].id}" onclick="initOrderDetail(${
      orders[i].id
    },${orders[i].ref})" class="order-no">${orders[i].ref}</span></td>
    <td>${orders[i].status}</td>
    <td>${orders[i].created_at.slice(0, 10)}</td>
    <td>${orders[i].delivery_date.slice(0, 10)}</td>
    <td>$${orders[i].total_amt}HKD</td>
  </tr>`;
  }
  let orderPageElem = document.querySelector(".order-page");
  orderPageElem.innerHTML = "";
  let totalPage = 1;
  totalOrderNo % 9 === 0
    ? (totalPage += totalOrderNo / 9 - 1)
    : (totalPage += totalOrderNo / 9);

  for (let i = 1; i <= totalPage; i++) {
    if (i === Number(pageNo)) {
      orderPageElem.innerHTML += `<span class="page-btn">Page${i}</span> `;
      continue;
    }
    orderPageElem.innerHTML += /*html*/ `<span onclick="getOrderHistory(${i})" class="page-btn next-page">Page${i}</span> `;
  }
}

async function initOrderDetail(orderNo, orderRef) {
  let displayAreaElem = document.querySelector(".display-content");
  displayAreaElem.innerHTML = /*html*/ `
  <div class="order-history-content">
    <div class="order-history-table">
      <div class="order-table-format">
        <h1>Order Ref: ${orderRef}</h1>
        <table id="tbOrderHistory" class="table border ps-table w-100 mb-3">
          <tr>
            <th class="font-weight-bold py-2 border-0">Product name</th>
            <th class="font-weight-bold py-2 border-0">Size</th>
            <th class="font-weight-bold py-2 border-0">Unit price</th>
            <th class="font-weight-bold py-2 border-0">Quantity</th>
            <th class="font-weight-bold py-2 border-0">Sub total</th>
          </tr>
        </table>
      </div>
    </div>
    <div class="total-price"></div>
    <div class="back-order" onclick="initOrderHistory()">Back To Order History</div>
  </div>`;
  let table = document.querySelector("#tbOrderHistory");
  table.innerHTML = /*HTML*/ `
  <tr>
    <th class="font-weight-bold py-2 border-0">Product name</th>
    <th class="font-weight-bold py-2 border-0">Size</th>
    <th class="font-weight-bold py-2 border-0">Unit price</th>
    <th class="font-weight-bold py-2 border-0">Quantity</th>
    <th class="font-weight-bold py-2 border-0">Sub total</th>
  </tr>
  `;
  let orderItemsJSON = await fetch(`/order-item/${orderNo}`);
  let orderItems = (await orderItemsJSON.json()).orderItems;
  let totalPrice = 0;
  for (let orderItem of orderItems) {
    let subtotal = Number(orderItem.unit_price) * Number(orderItem.quantity);
    table.innerHTML += /*HTML*/ `
    <tr>
    <td><a href="03-product-detail.html?productId=${orderItem.product_series_id}">${orderItem.product_name}</a></td>
    <td>${orderItem.size}</td>
    <td>${orderItem.unit_price}</td>
    <td>${orderItem.quantity}</td>
    <td>$${subtotal}HKD</td>
  </tr>`;
    totalPrice += subtotal;
  }
  let totalPriceElem = document.querySelector(".total-price");
  totalPriceElem.innerText = `Total:$${totalPrice}HKD`;
}
