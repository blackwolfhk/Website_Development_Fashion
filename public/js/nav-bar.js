let navBar = document.querySelector("#nav-bar");
if (navBar) {
  navBar.innerHTML = /*html*/ `
  <div class="navbar-background-color navbar-section">
      <nav class="navbar navbar-expand-md navbar-light bg-light d-flex">
        <div class="container-fluid">
          <div class="brand-img-container">
            <a class="navbar-brand m-0" href="index.html"
              ><img src="/photos/Logo.png"
            /></a>
          </div>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div
            class="collapse navbar-collapse justify-content-between"
            id="navbarNavDropdown"
          >
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="index.html"
                  >Home</a
                >
              </li>
              <li class="nav-item">
                <a
                  class="nav-link active"
                  aria-current="page"
                  href="02-about.html"
                  >About</a
                >
              </li>
              <li class="nav-item">
                <a
                  class="nav-link active"
                  aria-current="page"
                  href="03-product.html"
                  >Product</a
                >
              </li>
              <li class="nav-item">
                <a
                  class="nav-link active"
                  aria-current="page"
                  href="04-contact.html"
                  >Contact</a
                >
              </li>
            </ul>
            <div
              class="user-section d-flex justify-content-md-end justify-content-start"
            >
              <div class="user-section-icon drawer-icons search-icon">
                <div><i class="bi bi-search"></i></div>
                <div class="user-section-icon-title">Search</div>
              </div>
              <div class="user-section-icon drawer-icons login-icon">
                <div><i class="bi bi-person-circle"></i></div>
                <div class="user-section-icon-title">Login</div>
              </div>
              <div class="user-section-icon drawer-icons cart-icon ">
                <div><i class="bi bi-cart4"></i></div>
                <div class="user-section-icon-title">Cart</div>
              </div>
              <div class="user-section-icon profile-icon inactive-icon"><a href="06-profile.html">
                <div><i class="bi bi-person-video2"></i></div>
                <div class="user-section-icon-title">My profile</div></a>
              </div>
              <div class="user-section-icon logout-icon inactive-icon" onclick="homeLogout()">
                <div><i class="bi bi-box-arrow-right"></i></div>
                <div class="user-section-icon-title">Logout</div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  
  
  `;
}