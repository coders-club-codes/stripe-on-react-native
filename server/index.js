const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
const { Server } = require('http');

const privateStripeKey = 'SUA_CHAVE_PRIVADA';

const app = express();
const server = Server(app);

const stripe = new Stripe(privateStripeKey);

app.use(cors());
app.use(express.json());

app.get('/products', async (req, res) => {
  const { data } = await stripe.products.list({
    active: true,
  });

  return res.json(data);
});

app.post('/payment', async (req, res) => {
  if (!req.body.productId) {
    return res.status(400);
  }

  const { data } = await stripe.prices.list({
    product: req.body.productId,
  });

  const priceId = data[0].id;

  const session = await stripe.checkout.sessions.create({
    success_url: 'https://google.com',
    cancel_url: 'https://github.com',
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
  });

  return res.json({ checkoutUrl: session.url });
});

// app.get('/product/:id/price', async (req, res) => {
//   const { data } = await stripe.prices.list({
//     product: 'prod_KXIoITbHvNbR1C',
//   });

//   return res.json({ data });
// });

server.listen(3333, () => {
  console.log('Server listening on 3333 🔥');
});
