const express = require('express');
const bodyParser = require('body-parser');
const midtransClient = require('midtrans-client');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

// Configure CORS with options
const corsOptions = {
  origin: 'https://hexagon66613.github.io', // Your frontend domain
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to Your Shop API!');
});

// Initialize Midtrans client
const midtrans = new midtransClient.Snap({
  isProduction: true, // Set to true for production
  serverKey: 'Mid-server-9t2QptoETl-V08RbEVTuEKV0', // Replace with your actual server key
});

// Endpoint to create a transaction
app.post('/create_transaction', async (req, res) => {
  try {
    const orderDetails = req.body;
    console.log('Order Details:', orderDetails);

    // Remove or adjust fields based on your payment method configuration
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
