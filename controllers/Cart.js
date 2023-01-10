class Cart {
  constructor(id) {
    this.id = id;
    this.timestamp = Date.now();
    this.products = [];
  }
}

export default Cart;
