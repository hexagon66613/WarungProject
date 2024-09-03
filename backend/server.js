const express = require('express');
const bodyParser = require('body-parser');
const midtransClient = require('midtrans-client');
const app = express();

app.use(bodyParser.json());

const midtrans = new midtransClient.Snap({
  isProduction: false, // Set to true for production
  serverKey: 'Mid-server-9t2QptoETl-V08RbEVTuEKV0',
});

app.post('/create_transaction', (req, res) => {
  const orderDetails = req.body;

  midtrans.createTransaction(orderDetails)
    .then(transaction => {
      res.json({ token: transaction.token });
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
