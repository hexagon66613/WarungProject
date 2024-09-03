document.addEventListener('DOMContentLoaded', () => {
  const products = [
    { id: 1, name: 'Product 1', price: 10000 },
    { id: 2, name: 'Product 2', price: 20000 },
  ];

  let cart = [];

  const displayProducts = () => {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

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

  window.addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      cart.push(product);
      alert(`${product.name} added to cart!`);
    }
  };

  const calculateTotalAmount = () => {
    return cart.reduce((total, product) => total + product.price, 0);
  };

  document.getElementById('checkout').addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const totalAmount = calculateTotalAmount();
    const orderDetails = {
      transaction_details: {
        order_id: 'order-id-' + new Date().getTime(),
        gross_amount: totalAmount,
      },
      credit_card: {
        secure: true,
      },
    };

    fetch('https://ideal-goggles-jj46w6xqwj5qhp76g-3000.app.github.dev', { // Update URL if necessary
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
        snap.pay(data.token);
      } else {
        throw new Error('No token received');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });

  displayProducts();
});
