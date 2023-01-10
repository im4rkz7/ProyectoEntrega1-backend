import express, { Router } from "express";
import Cart from "./controllers/Cart.js";
import Product from "./controllers/Product.js";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Products array initialization.
let products = [];
// Carts array initialization.
let carts = [];
const PORT = 8080;

const fileProduct = "./products.json";
const fileCart = "./carts.json";

let administrator = true;

const productRouter = Router();
const cartRouter = Router();

// Get all products from products array.
productRouter.get("/", async (req, res) => {
  await getProducts();
  res.json(products);
});

// Get product by id.
productRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!idValidProducts(id)) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  await getProducts();

  const productFilter = products.find((product) => product.id === parseInt(id));

  res.json(productFilter);
});

// Add product in products array.
productRouter.post("/", async (req, res) => {
  if (administrator) {
    const id = products ? products.length + 1 : 1;

    const { name, description, code, photo, price, stock } = req.body;
    const productToAdd = new Product(
      id,
      name,
      description,
      code,
      photo,
      price,
      stock
    );

    products.push(productToAdd);

    await saveProducts();

    res.json(id);
    return;
  }

  res.status(403).json({
    error: -1,
    description: "ruta '/api/productos' método 'post' no autorizada",
  });
});

// Update product by id.
productRouter.put("/:id", async (req, res) => {
  if (administrator) {
    const { id } = req.params;
    const idNumber = parseInt(id);

    if (!idValidProducts(id)) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

    const { name, description, code, photo, price, stock } = req.body;
    const productToUpdate = new Product(
      idNumber,
      name,
      description,
      code,
      photo,
      price,
      stock
    );

    products[idNumber - 1] = { ...productToUpdate };

    await saveProducts();

    res.json(idNumber);
    return;
  }

  res.status(403).json({
    error: -1,
    description: "ruta '/api/productos/:id' método 'put' no autorizada",
  });
});

// Delete product by id from products array.
productRouter.delete("/:id", async (req, res) => {
  if (administrator) {
    const { id } = req.params;

    if (!idValidProducts(id)) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

    products = products.filter((product) => product.id !== parseInt(id));

    updateIdProducts();

    await saveProducts();

    res.json(parseInt(id));
    return;
  }

  res.status(403).json({
    error: -1,
    description: "ruta '/api/productos/:id' método 'put' no autorizada",
  });
});

const getProducts = () => {
  return fs.promises
    .readFile(fileProduct, "utf-8")
    .then((value) => JSON.parse(value))
    .then((productsInFile) => (products = productsInFile))
    .catch((e) => console.error(e));
};

const saveProducts = () => {
  fs.promises.writeFile(fileProduct, JSON.stringify([...products], null, 2));
};

// Add a cart to the carts array.
cartRouter.post("/", async (req, res) => {
  const id = carts ? carts.length + 1 : 1;

  const cartToAdd = new Cart(id);

  carts.push({ ...cartToAdd });

  await saveCart();

  res.json(id);
});

// Delete cart by id.
cartRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!idValidCarts(id)) {
    res.status(404).json({ error: "Carrito no encontrado" });
    return;
  }

  carts = carts.filter((cart) => cart.id !== parseInt(id));

  updateIdCarts();

  await saveCart();

  res.json(parseInt(id));
});

// Get cart by id.
cartRouter.get("/:id/productos", async (req, res) => {
  const { id } = req.params;

  if (!idValidCarts(id)) {
    res.status(404).json({ error: "Carrito no encontrado" });
    return;
  }

  await getCarts();

  const idCart = parseInt(id);
  const productsInCart = carts[idCart - 1].products;

  res.json(productsInCart);
});

// Add a product by its id to the cart by its id.
cartRouter.post("/:id/productos/:id_prod", async (req, res) => {
  const { id, id_prod } = req.params;

  if (!idValidCarts(id)) {
    res.status(404).json({ error: "Carrito no encontrado" });
    return;
  }

  if (!idValidProducts(id_prod)) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  const idCart = parseInt(id);
  const idProduct = parseInt(id_prod);

  const cart = carts[idCart - 1];

  const productsInCart = cart.products;

  const isInCart = (id) =>
    productsInCart.find((product) => product.id === id) ? true : false;

  if (!isInCart(idProduct)) {
    productsInCart.push({ id: idProduct, quantity: 1 });

    res.json(idCart);
    return;
  }

  const indexProductUpdate = productsInCart.findIndex(
    (product) => product.id === idProduct
  );

  productsInCart[indexProductUpdate].quantity++;

  await saveCart();

  res.json(idCart);
});

// Delete a product by its id to the cart by its id.
cartRouter.delete("/:id/productos/:id_prod", async (req, res) => {
  const { id, id_prod } = req.params;

  if (!idValidCarts(id)) {
    res.status(404).json({ error: "Carrito no encontrado" });
    return;
  }

  if (!idValidProducts(id_prod)) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  const idCart = parseInt(id);
  const idProduct = parseInt(id_prod);

  if (!idValidProductCart(idCart, idProduct)) {
    res.status(404).json({ error: "Producto no encontrado en el carrito" });
    return;
  }

  const cart = carts[idCart - 1];

  const productsInCart = cart.products;

  cart.products = productsInCart.filter((product) => product.id !== idProduct);

  await saveCart();

  res.json(idCart);
});

const getCarts = () => {
  return fs.promises
    .readFile(fileCart, "utf-8")
    .then((value) => JSON.parse(value))
    .then((cartsInFile) => (carts = cartsInFile))
    .catch((e) => console.error(e));
};

const saveCart = () => {
  fs.promises.writeFile(fileCart, JSON.stringify([...carts], null, 2));
};

app.use("/api/productos", productRouter);
app.use("/api/carrito", cartRouter);

app.listen(PORT);

// Verify that the product exists.
const idValidProducts = (id) => {
  const idNumber = parseInt(id);

  if (isNaN(id)) return false;
  if (idNumber > products.length || idNumber <= 0) return false;

  return true;
};

// Verify that the cart exists.
const idValidCarts = (id) => {
  const idNumber = parseInt(id);

  if (isNaN(id)) return false;
  if (idNumber > carts.length || idNumber <= 0) return false;

  return true;
};

// Verify that the product is in the cart.
const idValidProductCart = (id, id_prod) => {
  return carts[id - 1].products.some((product) => product.id === id_prod)
    ? true
    : false;
};

// Update products id.
const updateIdProducts = () => {
  for (let i = 0; i < products.length; i++) {
    products[i].id = i + 1;
  }
};

// Update carts id.
const updateIdCarts = () => {
  for (let i = 0; i < carts.length; i++) {
    carts[i].id = i + 1;
  }
};
