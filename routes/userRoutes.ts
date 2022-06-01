import express, { Request, Response } from "express";
import { client } from "../utils/db";
import { logger } from "../utils/logger";
import fetch from "node-fetch";
import { checkPassword, hashPassword } from "../utils/hash";
import nodemailer from "nodemailer";
import env from "../utils/env";
import { isloggedin } from "../utils/guard";
// http://localhost:8080/06-profile.html
interface GoogleUserProfile {
  email: string;
  image: string;
}

export let userRoutes = express.Router();

// Routes:
userRoutes.post("/user", createNewUser);
userRoutes.post("/signin", login);
userRoutes.post("/signout", logout);
userRoutes.get("/me", getMe);
userRoutes.get("/login/google", loginGoogle);
userRoutes.get("/orderHistory/:userId", isloggedin, getOrderHistoryById);
userRoutes.post("/shopping-cart", updateShoppingCartById);
userRoutes.post("/order", createOrder);
userRoutes.get("/personalDetails/:userId", checkPersonalDetails);
userRoutes.put("/changePassword", changePassword);

// Login handling
async function login(req: Request, res: Response) {
  let loginInfo = req.body;
  // console.log(loginInfo)

  // Check db and input, validation handling
  let dbUser = (
    await client.query(/*SQL*/ `select * from users where email = $1`, [
      loginInfo.email,
    ])
  ).rows[0];
  console.log(dbUser);
  if (!dbUser) {
    res.status(400).json({
      error: "Invalid user",
    });
    return;
  }

  let dbPassword = dbUser.password;
  if (!(await checkPassword(loginInfo.password, dbPassword))) {
    res.status(400).json({
      error: "Invalid password",
    });
    return;
  }

  delete dbUser.password;
  req.session["user"] = dbUser;

  await client.query(
    /*sql*/ `UPDATE users SET last_login = current_timestamp where id =$1`,
    [dbUser.id]
  );

  res.json({
    message: `Login successfully`,
  });
}

// Logout handling
function logout(req: Request, res: Response) {
  // let username = req.session["user"].username
  // logger.warn(`${username} is logging out`)
  if (req.session) {
    delete req.session["user"];
  }

  res.json({
    message: `logout successfully`,
  });
}

// Create new user handling
async function createNewUser(req: Request, res: Response) {
  logger.info(JSON.stringify(req.body, null, 4));

  // Create user details checking
  let { username, password, email, address, mobile, rePassword } = req.body;
  if (!username || !password || !email || !address || !mobile) {
    res.status(400).json({
      error: "Invalid input",
    });
    return;
  }

  // Validation

  let dbUser = (
    await client.query(/*SQL*/ `select * from users where email = $1`, [email])
  ).rows[0];

  if (dbUser) {
    res.status(400).json({
      error: "It is an existing user",
    });
    return;
  }

  if (password !== rePassword) {
    res.status(400).json({
      error: "Password is incorrect",
    });
    return;
  }

  if (username.length >= 10) {
    res.status(400).json({
      error: "User name must be less than 10 characters",
    });
    return;
  }

  if (mobile.length < 8 || isNaN(mobile)) {
    res.status(400).json({
      error: "Please input a valid mobile number",
    });
    return;
  }

  await client.query(
    /*SQL*/ `INSERT INTO USERS (username, password, email, address, mobile_no, created_at, updated_at, last_login)
        VALUES ($1,$2,$3,$4,$5,current_timestamp,current_timestamp,current_timestamp)
        `,
    [username, await hashPassword(password), email, address, mobile]
  );
  res.json({
    message: `Congratulations! ${username} is created!`,
  });
}

// Post login handling
function getMe(req: Request, res: Response) {
  if (!req.session["user"]) {
    res.status(403).json({
      message: "Not yet login, please try again.",
    });
    return;
  }
  res.json({
    data: req.session["user"],
  });
}

// Google login handling
async function loginGoogle(req: Request, res: Response) {
  const accessToken = req.session?.["grant"].response.access_token;

  const fetchRes = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const googleUserProfile = (await fetchRes.json()) as any as GoogleUserProfile;
  console.log(googleUserProfile);
  const users = (
    await client.query(`SELECT * FROM users WHERE users.username = $1`, [
      googleUserProfile.email,
    ])
  ).rows;
  let dbUser = users[0];

  if (!dbUser) {
    dbUser = (
      await client.query(
        /*SQL*/ `
            insert into users (username,password,mobile_no,email,address,is_admin,last_login, updated_at,created_at)
            values ($1,$2,$3,$4,$5,$6,current_timestamp,current_timestamp,current_timestamp) RETURNING *
            `,
        [
          googleUserProfile.email,
          "gpw",
          87654321,
          googleUserProfile.email,
          "Shatin",
          false,
        ]
      )
    ).rows[0];
  }

  if (req.session) {
    delete dbUser.password;
    req.session["user"] = dbUser;
  }
  res.redirect("/index.html");
}

//  Get historical orders
async function getOrderHistoryById(req: Request, res: Response) {
  try {
    let userId = req.params.userId;
    let pageNo = req.query.page;
    let orders = (
      await client.query(
        /*sql*/ `
          SELECT orders.id AS id,user_id,ref,status,delivery_date,created_at,updated_at,total_amt FROM orders 
          JOIN order_status on order_status_id=order_status.id
          where user_id = $1
          LIMIT 9 OFFSET $2
        `,
        [userId, (Number(pageNo) - 1) * 9]
      )
    ).rows;
    let totalOrder = (
      await client.query(
        /*sql*/ `
    SELECT * FROM orders
    JOIN order_status on order_status_id=order_status.id
    where user_id = $1
    `,
        [userId]
      )
    ).rows.length;

    res.json({ orders, totalOrder });
  } catch {
    console.log("get History error:", Error);
  }
}

// Update shopping cart
async function updateShoppingCartById(req: Request, res: Response) {
  let cartItems = req.body.cartItems;
  let userId = req.body.userId;
  await client.query(
    /*sql*/ `DELETE FROM shopping_cart_item where user_id=$1`,
    [Number(userId)]
  );
  for (let cartItem of cartItems) {
    client.query(
      /*sql*/ `INSERT INTO shopping_cart_item (product_id,user_id,quantity)VALUES($1,$2,$3)`,
      [cartItem.productId, userId, cartItem.qty]
    );
  }
  res.json({ message: "update shopping cart ok" });
}

// Create order handling
async function createOrder(req: Request, res: Response) {
  let cartItems = req.body.cartItems;
  let userId = req.body.userId;
  let cartRef = req.body.orderRef;
  let totalAmt = req.body.totalAmt;

  // cartItems -> loop id -> product price -> totalAmt
  let order = (
    await client.query(
      /*sql*/ `INSERT INTO orders (user_id,ref,order_status_id,delivery_date,created_at,updated_at,total_amt)
    VALUES ($1,$2,1,current_timestamp,current_timestamp,current_timestamp,$3) RETURNING id,ref`,
      [userId, cartRef, totalAmt]
    )
  ).rows[0];
  let orderId = order.id;
  let orderRef = order.ref;
  for (let cartItem of cartItems) {
    // add price columns into ordered_item
    await client.query(
      // INSERT INTO ordered_item (product_id,user_id,quantity,order_id, price) VALUES ($1,$2,$3,$4,$5)`,
      // [cartItem.productId, userId, cartItem.qty, orderId, price]

      /*SQL*/ `INSERT INTO ordered_item (product_id,user_id,quantity,order_id) VALUES ($1,$2,$3,$4)`,
      [cartItem.productId, userId, cartItem.qty, orderId]
    );
  }
  let userEmail = (
    await client.query(/*SQL*/ `SELECT * FROM users WHERE id=$1`, [userId])
  ).rows[0].email;
  sendOrderConfirmationEmail(userEmail, orderRef);
  res.json({ data: { orderId: orderId, orderRef: orderRef } });
}

// User profile - personal details
async function checkPersonalDetails(req: Request, res: Response) {
  let userId = req.params.userId;
  let personalDetails = (
    await client.query(
      /*sql*/ `
  SELECT * FROM users WHERE id = $1
  `,
      [userId]
    )
  ).rows;
  res.json({ personalDetails });
}

// User profile - change password
async function changePassword(req: Request, res: Response) {
  let userData = req.body;
  let oldPassword = userData.oldPassword;
  let newPassword = userData.newPassword;
  let userId = userData.userId;
  console.log(userData);
  // validation 

  let dbPassword = (
    await client.query(/*SQL*/ `select * from users where id = $1`, [userId])
  ).rows[0].password;
  console.log(dbPassword);
  if (await checkPassword(oldPassword, dbPassword)) {
    let hashNewPassword = await hashPassword(newPassword);
    await client.query(/*SQL*/ `UPDATE users SET password=$1 WHERE id=$2`, [
      hashNewPassword,
      userId,
    ]);
    res.json({ message: `update password completed for user-id:${userId}` });
    return;
  } else {
    res
      .status(400)
      .json({ message: `update password failed for user-id:${userId}` });
  }
}

// Auto confirmation email sending
function sendOrderConfirmationEmail(userEmail: string, orderRef: string) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.SHOP_EMAIL,
      pass: env.SHOP_PW,
    },
  });

  let mailOptions = {
    from: "freestylewspproject2022@gmail.com",
    to: userEmail,
    subject: `Order Confirmation-${orderRef}`,
    html: /*html*/ `
    <div>Dear Customer,</div>
    <br>
    <div>Thank you for your order.</div>
    <br>
    <div>Your order reference is : ${orderRef}</div>
    <br>
    <div>Regards</div>
    <div>Free Style</div>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
