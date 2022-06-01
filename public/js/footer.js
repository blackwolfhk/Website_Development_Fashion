let footer = document.querySelector("#footer");
if (footer) {
  footer.innerHTML = /*html*/ `
  <footer class="py-3 bg-light">
  <div class="row">
    <div class="col-2">
      <h5>Section</h5>
      <ul class="nav flex-column">
        <li class="nav-item mb-2">
          <a href="/html/index.html" class="nav-link p-0 text-muted"
            >Home</a
          >
        </li>
        <li class="nav-item mb-2">
          <a
            href="/html/07-shipping-info.html"
            class="nav-link p-0 text-muted"
            >Shipping info</a
          >
        </li>
        <li class="nav-item mb-2">
          <a
            href="/html/08-track-order.html"
            class="nav-link p-0 text-muted"
            >Track order</a
          >
        </li>
        <li class="nav-item mb-2">
          <a
            href="/html/09-return.html"
            class="nav-link p-0 text-muted"
            >Returns</a
          >
        </li>
      </ul>
    </div>
    <div class="col-2">
      <h5>Section</h5>
      <ul class="nav flex-column">
        <li class="nav-item mb-2">
          <a
            href="/html/04-contact.html"
            class="nav-link p-0 text-muted"
            >Contact us</a
          >
        </li>
        <li class="nav-item mb-2">
          <a
            href="/html/10-privacy-policy.html"
            class="nav-link p-0 text-muted"
            >Privacy Policy</a
          >
        </li>
        <li class="nav-item mb-2">
          <a
            href="/html/11-terms-conditions.html"
            class="nav-link p-0 text-muted"
            >Terms & Conditions</a
          >
        </li>
      </ul>
    </div>
    <div class="col-2">
      <h5>COVID-19 SITUATION</h5>
      <ul class="nav flex-column">
        <span class="covid-statement"
          >We do everything possible to make you receive your packages as
          soon as possible but for reasons beyond our control, the delivery
          time is extended because of COVID-19.
        </span>
      </ul>
    </div>
    <div class="col-4 offset-1">
      <form>
        <h5>Subscribe today to hear first about our sales</h5>
        <p class="subscription-text">
          Monthly digest of whats new and exciting from us.
        </p>
        <div class="d-flex w-100 gap-2">
          <label for="newsletter1" class="visually-hidden"
            >Email address</label
          >
          <input
            id="newsletter1"
            type="text"
            class="form-control"
            placeholder="Email address"
          />
          <button class="btn btn-primary" type="button">Subscribe</button>
        </div>
      </form>
    </div>
  </div>
  <br /><br />
  <h6>
    <p class="text-center text-muter">
      @ 2022 Free Style Limited. All rights reserved.
    </p>
  </h6>
</footer>
  
  
  `;
}
