document.addEventListener('DOMContentLoaded', () => {
  const products = [
    { id: 1, name: 'Product 1', price: 10000 },
    { id: 2, name: 'Product 2', price: 20000 },
  ];

  const productList = document.getElementById('product-list');
  products.forEach(product => {
    const productItem = document.createElement('div');
    productItem.innerHTML = `
      <h3>${product.name}</h3>
      <p>Price: ${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productList.appendChild(productItem);
  });

  window.addToCart = (productId) => {
    // Add product to cart logic
    alert('Product added to cart!');
  };

  document.getElementById('checkout').addEventListener('click', () => {
    // Example of order details
    const orderDetails = {
      transaction_details: {
        order_id: 'order-id-' + new Date().getTime(),
        gross_amount: 20000, // Total amount to be paid
      },
      credit_card: {
        secure: true,
      },
    };

    // Make an API call to your backend to get a token
    fetch('/create_transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderDetails),
    })
    .then(response => response.json())
    .then(data => {
      snap.pay(data.token); // Initiate payment
    });
  });
});
