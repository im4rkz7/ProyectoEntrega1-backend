class Product {
  constructor(id, name, description, code, photo, price, stock) {
    this.id = id;
    this.timestamp = Date.now();
    this.name = name;
    this.description = description;
    this.code = code;
    this.photo = photo;
    this.price = price;
    this.stock = stock;
  }
}

export default Product;
