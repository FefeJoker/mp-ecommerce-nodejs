const express = require('express');
const exphbs  = require('express-handlebars');
const mercadopago = require('mercadopago');
const parser = require('body-parser');
const path = require('path');

const app = express();



mercadopago.configure({
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004',
    access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398'
});
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/failure', function (req, res) {
  res.render('failure');
});

app.get('/pending', function (req, res) {
  res.render('pending');
});

app.get('/success', function (req, res) {
  res.render('success', req.query);
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

app.post('/pagar', (req, res) => {
    let preference = {
        items: [
          {
            id: req.body.id,
            title: req.body.nombre,
            description: req.body.description,
            img: path.join(__dirname, req.body.imagen),
            unit_price: Number(req.body.precio),
            quantity: 1,
            request: req.body.orden,
          }
        ],
        payer: {
          id: "471923173",
          password: "qatest2417",
          name: "Lalo",
          surname: "Landa", 
          email: "test_user_63274575@testuser.com",
          phone: {
            area_code: "11",
            number: 22223333
          },
          address: {
            street_name: "False",
            street_number: 123,
            zip_code: "1111"
          }
        },
        back_urls: {
          success: "https://fefejoker-mp-ecommerce-nodejs.herokuapp.com/success",
          failure: "https://fefejoker-mp-ecommerce-nodejs.herokuapp.com/failure",
          pending: "https://fefejoker-mp-ecommerce-nodejs.herokuapp.com/pending"
        },
        auto_return: "approved",
        payment_methods: {
          exclude_payment_methods: [
            {
              id: "visa"
            }
          ],
          exclude_payment_types: [
            {
              id: "atm"
            }
          ],
          installments: 6
        },
        notification_url: "",
        external_reference: req.body.orden
    };

    mercadopago.preferences.create(preference).then((response) => {
      res.redirect(response.response.init_point)
    }).catch((error) => {
      console.log(error);
    })

    //res.redirect("https://www.mercadopago.com.mx/integrations/v1/web-payment-checkout.js");
});

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));
 
app.listen(process.env.PORT || 3000);