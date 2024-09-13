const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const Product = require('./models/Product'); // Adjust path as needed

const server = http.createServer(app);
const io = socketIo(server);

// WebSocket connection
io.on('connection', (socket) => {
  console.log('New client connected');

  // Send updated product list to new clients
  Product.find().then(products => {
    socket.emit('updateProducts', products);
  });

  // Handle product updates from seller
  socket.on('updateProduct', async (product) => {
    try {
      if (product.id) {
        // Update existing product
        const existingProduct = await Product.findById(product.id);
        if (existingProduct) {
          existingProduct.name = product.name;
          existingProduct.price = product.price;
          await existingProduct.save();
        } else {
          throw new Error('Product not found');
        }
      } else {
        // Add new product
        const newProduct = new Product(product);
        await newProduct.save();
      }

      // Notify all clients about the product update
      io.emit('updateProducts', await Product.find());
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  // Handle product deletions from seller
  socket.on('deleteProduct', async (productId) => {
    try {
      await Product.findByIdAndDelete(productId);
      io.emit('updateProducts', await Product.find());
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server running on port 3000');
});
