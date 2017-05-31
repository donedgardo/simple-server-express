var mongoose = require('mongoose');

const ProductsSchema = new mongoose.Schema({
  name: String,
  price: Number,
  qty: {
    type: Number,
    default: 0,
  }
});

const Products = mongoose.model('products', ProductsSchema);

module.exports = Products;
