const express = require('express');
const bodyParser = require('body-parser');
const midtransClient = require('midtrans-client');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to Your Shop API!');
});

// Initialize Midtrans client
const midtrans = new midtransClient.Snap({
  isProduction: false, // Set to true for production
  serverKey: 'Mid-server-9t2QptoETl-V08RbEVTuEKV0', // Replace with your server key
});

// Endpoint to create a transaction
app.post('/create_transaction', (req, res) => {
  const orderDetails = req.body;

  // Log order details for debugging
  console.log('Order Details:', orderDetails);

  midtrans.createTransaction(orderDetails)
    .then(transaction => {
      res.json({ token: transaction.token });
    })
    .catch(error => {
      console.error('Transaction Error:', error); // Log error for debugging
      res.status(500).json({ error: error.message });
    });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
