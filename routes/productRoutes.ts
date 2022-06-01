import express, { Request, Response } from "express";
import { client } from "../utils/db";

export let productRoutes = express.Router();

productRoutes.get("/products", getAllProducts);
productRoutes.get("/product-types", getAllProductTypes);
productRoutes.get("/product-sizes", getAllProductSizes);
productRoutes.get("/check-products/:id", checkProductById);
productRoutes.get("/product-generation", getAllProductGeneration);
productRoutes.get("/products/:id", getProductById);
productRoutes.get("/products/page/:pageNum", getProductsByPage);
productRoutes.get("/shopping-cart/:NoOfItem", getShoppingCartList);
productRoutes.get("/get-cart/:id", getShoppingCartById);
productRoutes.get("/order-item/:orderId", getOrderItemByOrderId);
productRoutes.delete("/shopping-cart", deleteShoppingCartById);

async function getAllProducts(req: Request, res: Response) {
  let products = (
    await client.query(/*sql*/ `select product_series.id,name,product_type_id,product_generation_id,image,description,unit_price,type AS generation
      from product_series JOIN product_generation on product_generation.id =product_series.product_generation_id LIMIT 9 OFFSET 0;`)
  ).rows;
  res.json({
    data: products,
  });
}

async function getAllProductTypes(req: Request, res: Response) {
  let productTypes = (await client.query(/*sql*/ `select * from product_types`))
    .rows;

  res.json({ data: productTypes });
}

async function getAllProductSizes(req: Request, res: Response) {
  let productSizes = (await client.query(/*sql*/ `select * from product_size`))
    .rows;

  res.json({ data: productSizes });
}

async function getAllProductGeneration(req: Request, res: Response) {
  let productGeneration = (
    await client.query(/*sql*/ `select * from product_generation`)
  ).rows;

  res.json({ data: productGeneration });
}

async function getProductById(req: Request, res: Response) {
  let pid = req.params.id;
  let product = (
    await client.query(
      /*sql*/ `select product_series.id,name,product_type_id,product_generation_id,image,description,unit_price,product_generation.type AS generation,product_types.type AS type
  from product_series
  JOIN product_generation on product_generation.id =product_series.product_generation_id 
  JOIN product_types on product_types.id=product_type_id WHERE product_series.id = $1`,
      [pid]
    )
  ).rows[0];
  res.json({
    data: product,
  });
}

async function checkProductById(req: Request, res: Response) {
  let pid = req.params.id;
  let product = (
    await client.query(
      /*sql*/ ` SELECT products.id AS product_id,size_id,product_series_id,size,image
        FROM products
        JOIN product_size ON product_size.id = size_id 
        JOIN product_series on product_series.id = product_series_id
        WHERE product_series_id = $1
        `,
      [pid]
    )
  ).rows;
  res.json({
    data: product,
  });
}

async function getProductsByPage(req: Request, res: Response) {
  let pageNum = req.params.pageNum;
  let filter = req.query;
  let productName = filter.productName as string;

  let sqlString =
    "select product_series.id,name,product_type_id,product_generation_id,image,description,unit_price,product_generation.type AS generation,product_types.type AS type from product_series JOIN product_generation on product_generation.id =product_series.product_generation_id JOIN product_types on product_types.id=product_type_id ";
  let sqlStringLimit = ` LIMIT 9 OFFSET $1`;

  console.log(filter)
  if (!(Object.keys(filter).length === 0)) {
    let sqlFilter = /*sql*/ ` WHERE `;
    if (filter.typesId) {
      sqlFilter += `product_type_id = ${filter.typesId} AND `;
    }
    if (filter.price) {
      sqlFilter += `unit_price < ${filter.price} AND `;
    }
    if (filter.generation) {
      sqlFilter += `product_generation_id = ${filter.generation} AND`;
    }
    if (filter.productName) {
      sqlFilter += ` UPPER(name) LIKE '%${productName.toUpperCase()}%' AND`;
    }
    sqlFilter = sqlFilter.slice(0, -4);
    sqlString += sqlFilter;
  }
  let totalProductSql = sqlString;
  sqlString += sqlStringLimit;

  let products = (
    await client.query(/*sql*/ sqlString, [(Number(pageNum) - 1) * 9])
  ).rows;
  let totalNumOfProducts = (await client.query(/*sql*/ totalProductSql)).rows
    .length;
  res.json({
    data: products,
    total: totalNumOfProducts,
  });
}

async function getShoppingCartList(req: Request, res: Response) {
  let productIds = req.query.productId;
  let productQty = req.query.qty;
  let numOfItem = Number(req.params.NoOfItem);
  let cartItems = [];
  if (productIds && productQty) {
    if (numOfItem === 1) {
      cartItems.push({
        itemDetails: (
          await client.query(
            /*sql*/ ` SELECT products.id AS product_id,size_id,product_series_id,name,size,image,stock_level,product_types.type AS product_type,product_generation.type AS product_generation,unit_price
    FROM products
    JOIN product_size ON product_size.id = size_id
    JOIN product_series ON product_series.id = product_series_id
    JOIN product_types ON product_series.product_type_id = product_types.id
    JOIN product_generation ON product_series.product_generation_id = product_generation.id
    JOIN inventory ON inventory.product_id = products.id
    WHERE products.id = $1
    `,
            [productIds]
          )
        ).rows,
        requiredQty: productQty,
      });
      res.json({ cartItems });
      return;
    }

    for (let i = 0; i < numOfItem; i++) {
      let cartItem = {
        itemDetails: (
          await client.query(
            /*sql*/ ` SELECT products.id AS product_id,size_id,product_series_id,name,size,image,stock_level,product_types.type AS product_type,product_generation.type AS product_generation,unit_price
      FROM products
      JOIN product_size ON product_size.id = size_id
      JOIN product_series ON product_series.id = product_series_id
      JOIN product_types ON product_series.product_type_id = product_types.id
      JOIN product_generation ON product_series.product_generation_id = product_generation.id
      JOIN inventory ON inventory.product_id = products.id
      WHERE products.id = $1
      `,
            [productIds[i]]
          )
        ).rows,
        requiredQty: productQty[i],
      };

      cartItems.push(cartItem);
    }

    res.json({ cartItems });
  } else {
    res.json({
      message: "invalid request",
    });
  }
}

async function getShoppingCartById(req: Request, res: Response) {
  let userId = req.params.id;
  let shoppingCart = (
    await client.query(
      /*sql*/ `SELECT * FROM shopping_cart_item where user_id = $1`,
      [userId]
    )
  ).rows;
  res.json({ shoppingCart });
}

async function getOrderItemByOrderId(req: Request, res: Response) {
  let orderId = req.params.orderId;
  let orderItems = (
    await client.query(
      /*sql*/ `
  SELECT product_series.name AS product_name,product_size.size AS size,quantity,unit_price,order_id,product_series.id AS product_series_id
  FROM ordered_item 
      JOIN products on products.id=product_id
      JOIN product_series on product_series.id = products.product_series_id
      JOIN product_size on product_size.id = products.size_id
  WHERE ordered_item.order_id = $1
  `,
      [orderId]
    )
  ).rows;
  res.json({ orderItems });
}

async function deleteShoppingCartById(req: Request, res: Response) {
  let userId = req.body.userId;
  await client.query(
    /*sql*/ `DELETE FROM shopping_cart_item WHERE user_id=$1`,
    [userId]
  );
  res.json({
    message: `delete shopping cart with user-id: ${userId} success`,
  });
}
