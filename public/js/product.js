let productDisplayElem = document.querySelector(".product-display-session");
let typeDisplayElem = document.querySelector("#categories");
let generationDisplayElem = document.querySelector("#generations");
let pageElem = document.querySelector("#product-pages");
let filterFormElem = document.querySelector("#filter-form");
let filterSearchBtn = document.querySelector("#search-btn");
// let filterStr = "";

window.load = (async () => {
  let pageNo = getQuery().page || 1;
  let productName = getQuery().productName;
  await fetchAllProductTypes();
  await fetchAllProductGeneration();
  if (productName) {
    await fetchProductsByPage(pageNo);
  } else {
    await fetchProductsByPage(pageNo);
  }
})();

async function fetchProductsByPage(page) {
  let query = window.location.search
  let res = await fetch(`/products/page/${page}${query}`);
  console.log("res:", res);
  let result = await res.json();
  console.log("result:", result);
  let products = result.data;
  console.log("products:", products);
  let totalProducts = result.total;
  console.log("totalProducts:", totalProducts);

  productDisplayElem.innerHTML = "";
  for (let product of products) {
    let productHTML = /*HTML*/ `   
      <div class="col-6 col-lg-4 g-mb-30 product-card">
        <figure class="g-pos-rel g-mb-20 product-img">
         <img class="img-fluid img-product" src=${product.image} alt="Image Description">
        </figure>
        <div class="media">
            <div class="d-flex flex-column">
                <h4 class="h6 g-color-black mb-1">
                <a class="u-link-v5 g-color-black g-color-primary--hover"
                      href="03-product-detail.html?productId=${product.id}">
                   ${product.name}
                </a>
                 </h4>
                <div class="d-inline-block g-color-gray-dark-v5 g-font-size-13">${product.generation}</div>
                <div class="d-inline-block g-color-gray-dark-v5 g-font-size-13">${product.type}</div>
            <span class="d-block g-color-black g-font-size-17">$${product.unit_price}</span>
            </div>
        </div>
      </div>`;
    productDisplayElem.innerHTML += productHTML;
  }
  pageElem.innerHTML = "";
  let totalPage = 1;
  totalProducts % 9 === 0 ?
    (totalPage += totalProducts / 9 - 1) :
    (totalPage += totalProducts / 9);
  for (let i = 1; i <= totalPage; i++) {
    if (i === Number(page)) {
      pageElem.innerHTML += `<span class="page-btn">page${i}</span> `;
      continue;
    }
    pageElem.innerHTML += /*html*/ `<span onclick="fetchProductsByPage(${i})" class="page-btn next-page">page${i}</span> `;
  }
}

async function fetchAllProductTypes() {
  let res = await fetch("/product-types");
  let pTypes = (await res.json()).data;
  for (let pType of pTypes) {
    let typeHTML = /*HTML*/ `<li class="my-3">
    <label
      class="form-check-inline u-check d-block u-link-v5 g-color-gray-dark-v4 g-color-primary--hover g-pl-30"
    >
      <input
        class="g-hidden-xs-up g-pos-abs g-top-0 g-left-0"
        type="radio"
        name="productType"
        id="productType${pType.id}"
      />
      ${pType.type}
    </label>
  </li>`;
    typeDisplayElem.innerHTML += typeHTML;
  }
}

async function fetchAllProductGeneration() {
  let res = await fetch("/product-generation");
  let pGenerations = (await res.json()).data;
  for (let pGeneration of pGenerations) {
    let generationHTML = /*HTML*/ `
    <li class="my-2">
    <label
      class="form-check-inline u-check d-block u-link-v5 g-color-gray-dark-v4 g-color-primary--hover g-pl-30"
    >
      <input
        class="g-hidden-xs-up g-pos-abs g-top-0 g-left-0"
        type="radio"
        name="generation"
        id="productGeneration${pGeneration.id}"
      />
      ${pGeneration.type}
    </label>
  </li>`;
    generationDisplayElem.innerHTML += generationHTML;
  }
}

function getQuery() {
  let search = new URLSearchParams(window.location.search);
  return {
    page: search.get("page"),
    productName: search.get("productName")
  };
}

function createFilterQuery() {
  let queryString = "?";
  let productTypeOptions = filterFormElem.productType;
  let filterTypeId;

  let params = window.location.search
  let url = new URL(window.location.href);

  // categories
  for (let option of productTypeOptions) {
    if (option.checked) {
      filterTypeId = option.id.replace("productType", "");
    }
  }

  // Generation
  let productGenerationOptions = filterFormElem.generation;
  let filterGenerationId;
  for (let option of productGenerationOptions) {
    if (option.checked) {
      filterGenerationId = option.id.replace("productGeneration", "");
    }
  }
  if (filterTypeId) {
    queryString += `typesId=${filterTypeId}&`;
    url.searchParams.set('typesId', filterTypeId);
  }

  // Price
  queryString += `price=${filterFormElem.price.value}&`;
  url.searchParams.set('price', filterFormElem.price.value);

  if (filterGenerationId) {
    queryString += `generation=${filterGenerationId}&`;
    url.searchParams.set('generation', filterGenerationId);
  }
  queryString = queryString.slice(0, -1);
  window.location.href = url.href
  // console.log(url.href)
  return queryString;
}

function fetchProductWithFilter() {
  createFilterQuery();
  // filterStr = query;
  fetchProductsByPage(1);
  // return query

}