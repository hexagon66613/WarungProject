document.addEventListener('DOMContentLoaded', () => {
  // List of products
  const products = [
    { id: 1, name: 'Product 1', price: 10000 },
    { id: 2, name: 'Product 2', price: 20000 },
  ];

  // Cart to keep track of added products
  let cart = [];

  // Function to display products
  const displayProducts = () => {
    const productList = document.getElementById('product-list');
    if (!productList) return; // Safeguard if element is not found

    productList.innerHTML = ''; // Clear existing products

    products.forEach(product => {
      const productItem = document.createElement('div');
      productItem.innerHTML = `
        <h3>${product.name}</h3>
        <p>Price: ${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      productList.appendChild(productItem);
    });
  };

  // Function to add products to cart
  window.addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      cart.push(product);
      updateCartDisplay(); // Update the cart display
      alert(`${product.name} added to cart!`);
    }
  };

  // Function to calculate total amount
  const calculateTotalAmount = () => {
    return cart.reduce((total, product) => total + product.price, 0);
  };

  // Function to update cart display
  const updateCartDisplay = () => {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return; // Safeguard if element is not found

    if (cart.length === 0) {
      cartItems.innerHTML = 'No items in cart';
    } else {
      const cartContent = cart.map(product => `
        <div>
          <h4>${product.name}</h4>
          <p>Price: ${product.price}</p>
        </div>
      `).join('');
      cartItems.innerHTML = cartContent;
    }
  };

  // Event listener for checkout button
  document.getElementById('checkout').addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const totalAmount = calculateTotalAmount();
    const orderDetails = {
      transaction_details: {
        order_id: 'order-id-' + new Date().getTime(),
        gross_amount: totalAmount, // Total amount to be paid
      },
      // Remove or adjust according to your payment methods
    };

    // Make an API call to your backend to get a token
    fetch('https://didactic-adventure-4jg494xw97xgc55pw-3000.app.github.dev/create_transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderDetails),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.token) {
        snap.pay(data.token); // Initiate payment using Midtrans Snap
      } else {
        throw new Error('No token received');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });

  // Initialize products and cart display on page load
  displayProducts();
  updateCartDisplay();
});
