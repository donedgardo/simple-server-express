var express = require('express');
var ejs = require('ejs');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var stripe = require('stripe')(process.env.STRIPE_SECRET);


mongoose.connect('mongodb://localhost/test-products');
var Products = require('./models/products');

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Home
app.get('/', function(request, response){
  // const products = [
  //   {name: 'Mother Board X100'},
  //   {name: 'VGA nVidia 8800'}
  // ];
  // response.send('<h2>Hello Codetrotters!</h2><p>hello paragrah</p>');
  Products.find(function(err, products){
    response.render('pages/index', { products: products });
  });
});

// Product Detail
app.get('/products/:id', function(req, res){
  // console.log(req.params); // { id: #####, user: '' }
  Products.findOne(
    { _id: req.params.id },
    function(err, product){
      res.render('pages/product', { product: product, user: 'Edgardo' });
    }
  );
});

// Charge Prodct
app.post('/charge/:id', function(req, res){
  Products.findOne({_id: req.params.id}, function(err, product){
    stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken
    })
    .then(function(customer){
      stripe.charges.create({
        amount: product.price,
        description: "Sample Charge",
        currency: "usd",
        customer: customer.id
      })
    }).then(function(charge){
      res.send("<h1>Charged, Thank You!</h1>")
    });
  });// End Product Find One
});

const PORT = 3000
app.listen(PORT, function(){
  console.log(`Server up and running on port ${PORT}!`);
});
