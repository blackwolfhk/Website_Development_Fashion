select product_series.id,
  name,
  product_type_id,
  product_generation_id,
  image,
  description,
  unit_price,
  product_generation.type AS generation,
  product_types.type AS type
from product_series
  JOIN product_generation on product_generation.id = product_series.product_generation_id
  JOIN product_types on product_types.id = product_type_id
SELECT products.id AS id,
  name,
  unit_price,
  image
FROM products
  JOIN product_series on product_series.id = product_series_id
WHERE product_series_id = 1
  AND size_id = 3
SELECT products.id AS product_id,
  size_id,
  product_series_id,
  size
FROM products
  JOIN product_size ON product_size.id = size_id
WHERE product_series_id = 32 DROP TABLE shopping_cart_item
INSERT INTO orders (
    user_id,
    ref,
    order_status_id,
    delivery_date,
    created_at,
    updated_at,
    total_amt
  )
VALUES (
    1,
    '23451',
    2,
    current_timestamp,
    current_timestamp,
    current_timestamp,
    3000
  )
INSERT INTO shopping_cart_item (product_id, user_id, quantity)
VALUES (5, 12, 2)
DELETE FROM shopping_cart_item
where user_id = 12 TRUNCATE TABLE ordered_item RESTART IDENTITY CASCADE;
TRUNCATE TABLE orders RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;
with orders as (
  SELECT orders.id AS id,
    user_id,
    ref,
    status,
    delivery_date,
    created_at,
    updated_at,
    total_amt
  FROM orders
    JOIN order_status on order_status_id = order_status.id
  where user_id = 12
  LIMIT 9 OFFSET 0
)
select count(*)
from orders