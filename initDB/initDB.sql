create DATABASE wsp_project

\c wsp_project

CREATE TABLE product_types(
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL
);

INSERT INTO product_types(type) VALUES ('Clothes'),('T-shirts'),('Jackets'),('Bottoms');



CREATE TABLE product_generation(
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL
);

INSERT INTO product_generation(type) VALUES ('Men'),('Women'),('Child');

CREATE TABLE product_size(
    id SERIAL PRIMARY KEY,
    size VARCHAR(255) NOT NULL
);

INSERT INTO product_size(size) VALUES ('Small'),('Medium'),('Large');

CREATE TABLE order_status(
    id SERIAL PRIMARY KEY,
    status VARCHAR(255) NOT NULL
);

INSERT INTO order_status(status) VALUES ('Pending'), ('In Transit'),('Shipping'),('Completed'),('Cancelled');

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    mobile_no INTEGER ,
    email VARCHAR(255) NOT NULL,
    address TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    last_login DATE NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE orders(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    ref VARCHAR(255) NOT NULL,
    order_status_id INTEGER NOT NULL,
    delivery_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    total_amt INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (order_status_id) REFERENCES order_status(id)
);

CREATE TABLE product_series(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    product_type_id INTEGER NOT NULL,
    product_generation_id INTEGER NOT NULL,
    unit_price INTEGER NOT NULL,
    image TEXT,
    description TEXT,
    FOREIGN KEY (product_type_id) REFERENCES product_types(id),
    FOREIGN KEY (product_generation_id) REFERENCES product_generation(id)
);

CREATE TABLE products(
    id SERIAL PRIMARY KEY,
    size_id INTEGER NOT NULL,
    product_series_id INTEGER NOT NULL,
    FOREIGN KEY (size_id) REFERENCES product_size(id),
    FOREIGN KEY (product_series_id) REFERENCES product_series(id)
);

CREATE TABLE ordered_item(
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    order_id INTEGER NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE shopping_cart_item(
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE inventory(
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    stock_level INTEGER NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);



-- fetch all products query
-- select product_series.id,name,product_type_id,product_generation_id,image,description,unit_price,type from product_series JOIN product_generation on product_generation.id =product_series.product_generation_id;

