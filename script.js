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
    // Handle checkout
    alert('Proceeding to checkout!');
  });
});
