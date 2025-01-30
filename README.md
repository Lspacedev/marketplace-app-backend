# MERN Marketplace App | BACKEND

Node Express Marketplace API that allows users to create and manage products.

### Marketplace App | Frontend

[https://github.com/Lspacedev/marketplace-app-frontend](https://github.com/Lspacedev/marketplace-app-frontend)

## Prerequisites

- Nodejs
- A Cloudinary account, follow the link [here](https://cloudinary.com/)

## Installation

1. Clone the repository

```bash
git@github.com:Lspacedev/marketplace-app-backend.git
```

2. Navigate to the project folder

```bash
cd marketplace-app-backend
```

3.  Install all dependencies

```bash
npm install
```

4. Create an env file and add the following:

```bash
PORT="Specify your port here"
MONGO_URI2="MongoDb database uri"
JWT_SECRET="Jwt secret"
CLOUDINARY_CLOUD_NAME="Cloudinary cloud name"
CLOUDINARY_API_KEY="Cloudinary api key"
CLOUDINARY_SECRET_KEY="Cloudinary secret key"
GUEST_USERNAME="Guest username"
GUEST_PASSWORD="Guest password"

```

5. Run the project

```bash
node index
```

## Usage

1. The server should run on PORT 8000, unless a port is specified.
2. Use http://localhost:8000, to test the API on Postman or any other tool.

## Routes:

API is built using a Node Express server, with MongoDb as a database.
Api uses JWT tokens to authenticate user.

#### Index Router:

- Register an account.
- Login to an account.
- Guest login.
- Get user cart.
- Add to Cart.
- Delete from Cart.
- Get and Update Profile.
- Become a seller.

Endpoints

```python
    1. POST /api/register
        Inputs: username, email, password, street, town, city, country.

    2.1 POST /api/login
            Inputs: username, password
    2.2 POST /api/guest-log-in

    3. GET /api/profile
    4. PUT /api/profile
            Inputs: username, email, password

    5. GET /api/cart
    6. POST /api/cart
        Inputs: productId
    7. DELETE /api/cart/:productId
      Params: productId

    8. PUT /profile/become-seller

```

#### Product Router:

- Get all seller's products.
- Get individual seller's product.
- Add to seller's products.
- Update seller's product.
- Delete seller's product.
- Hide seller's product.

Endpoints

```python
    1. POST /api/products
        Inputs:  name, price, category, description, location, condition, tags,delivery, Image *** (MAX LENGTH: 3) ***

    2. PUT /api/products/:productId
            Params: productId
            Inputs: name, price, description, location, condition, tags, delivery.

    3. PUT /api/products/:productId/hide
            Params: productId

    4. DELETE /api/cart/:productId
      Params: productId

    5. GET /api/products
    6. GET /api/products/:productId
        Params: productId


    7. PUT /profile/become-seller

```

#### Public Router:

- Get all products.
- Get individual product.
- Buy product

Endpoints

```python
    1. GET /api/public/products
    2. GET /api/public/products/:productId
        Params: productId

    3. PUT /api/public/products/:productId/buy
            Params: productId

```

#### Reviews Router:

- Get all products.
- Get individual product.
- Buy product

Endpoints

```python
    1. GET /api/public/reviews
        Query:  page = 1, limit = 1
    2. POST /api/public/reviews
        Inputs:  seller, rating, reviewText
```

## Tech Stack

- NodeJs
- Express
- MongoDb
