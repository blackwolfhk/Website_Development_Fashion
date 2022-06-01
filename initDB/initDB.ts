import pg from "pg";
import env from "../utils/env";
import Chance from "chance";

const fakePassword = "1234";
const customerNum = 10;

const client = new pg.Client({
  database: env.DB_NAME,
  user: env.DB_USERNAME,
  password: env.DB_PASSWORD,
});

let chance = new Chance();
let sampleDataSize = 50;

async function initDB() {
  try {
    await client.connect(); // "dial-in" to the postgres server
    await initUser();
    await initProductSeries();
    await initProductsAndInventory();
  } catch (error) {
    console.error("DB connect error : " + error);
  } finally {
    await client.end();
  }
}

// Create new users 
async function initUser() {
  // User
  for (let i = 1; i < customerNum; i++) {
    let fakeName = chance.name();

    await client.query(
      /*SQL*/ `
    insert into users (username,password,mobile_no,email,address,is_admin,last_login, updated_at,created_at)
    values ($1,$2,$3,$4,$5,$6,current_timestamp,current_timestamp,current_timestamp)
    `,
      [fakeName, fakePassword, 12345678, "1234@gmail.com", "Hong Kong", false]
    );
  }
  await client.query(
    /*SQL*/ `
  insert into users (username,password,mobile_no,email,address,is_admin,last_login, updated_at,created_at)
  values ($1,$2,$3,$4,$5,$6,current_timestamp,current_timestamp,current_timestamp)
  `,
    ["admin", "admin", 12345678, "admin@admin.com", "Hong Kong", true]
  );
}

// Create new products
async function initProductSeries() {
  try {
    await client.query(
      /*SQL*/ `TRUNCATE TABLE product_series  RESTART IDENTITY CASCADE`
    );
    for (let i = 0; i < sampleDataSize; i++) {
      let fakeName = "Series-" + chance.name();
      let productType = Math.floor(Math.random() * 4 + 1);
      let productGeneration = Math.floor(Math.random() * 3 + 1);
      let unitPrice = Math.floor(Math.random() * 1000 + 1);
      let randomImg = ``;
      if (productGeneration == 1) {
        randomImg = `/photos/man-jacket${i % 7}.jpeg`;
      }
      if (productGeneration == 2) {
        randomImg = `/photos/woman-jacket${i % 3}.jpeg`;
      }
      if (productGeneration == 3) {
        randomImg = `/photos/child-fashion${i % 6}.jpeg`;
      }
      let description = chance.paragraph();
      await client.query(
        /*SQL*/ `INSERT INTO product_series(name, product_type_id, product_generation_id, unit_price, image, description)
        VALUES($1, $2, $3, $4, $5, $6)`,
        [
          fakeName,
          productType,
          productGeneration,
          unitPrice,
          randomImg,
          description,
        ]
      );
    }
    // let result = await client.query(/*SQL*/ `SELECT * from product_series`);
    // let dbTable = result.rows;
    // console.table(dbTable);
  } catch (error) {
    console.error("init product series error : " + error);
  }
}


async function initProductsAndInventory() {
  try {
    await client.query(
      /*SQL*/ `TRUNCATE TABLE products  RESTART IDENTITY CASCADE`
    );
    await client.query(
      /*SQL*/ `TRUNCATE TABLE inventory  RESTART IDENTITY CASCADE`
    );
    for (let i = 1; i <= sampleDataSize; i++) {
      let productSeries = i;
      let productSize = Math.floor(Math.random() * 3 + 1);
      let stocks = Math.floor(Math.random() * 10 + 100);
      for (let j = 1; j <= productSize; j++) {
        let result = await client.query(
          /*SQL*/ `INSERT INTO products(size_id, product_series_id)
        VALUES($1, $2) RETURNING id`,
          [j, productSeries]
        );

        let productId = result.rows[0].id;
        await client.query(
          /*SQL*/ `INSERT INTO inventory(product_id, stock_level) VALUES($1, $2)`,
          [productId, stocks]
        );
      }
    }
    let products = (await client.query(/*SQL*/ `SELECT * from products`)).rows;
    let inventory = (await client.query(/*SQL*/ `SELECT * from inventory`)).rows;
    console.table(products);
    console.table(inventory);
  } catch (error) {
    console.error("init product and inventory error : " + error);
  }
}

initDB();

// random img:https://picsum.photos/200
