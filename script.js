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
      alert(`${product.name} added to cart!`);
    }
  };

  // Function to calculate total amount
  const calculateTotalAmount = () => {
    return cart.reduce((total, product) => total + product.price, 0);
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
      credit_card: {
        secure: true,
      },
    };

    // Make an API call to your backend to get a token
    fetch('https://vigilant-cod-7vrq4qgp4rvjfj49-3000.app.github.dev', {
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

  // Initialize products on page load
  displayProducts();
});
