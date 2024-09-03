const express = require('express');
const bodyParser = require('body-parser');
const midtransClient = require('midtrans-client');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS

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
app.post('/create_transaction', async (req, res) => {
  try {
    const orderDetails = req.body;
    console.log('Order Details:', orderDetails);

    const transaction = await midtrans.createTransaction(orderDetails);
    res.json({ token: transaction.token });
  } catch (error) {
    console.error('Transaction Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
