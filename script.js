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
        <input type="number" id="quantity-${product.id}" value="1" min="1" />
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      productList.appendChild(productItem);
    });
  };

  // Function to add products to cart
  window.addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantityInput.value, 10) || 1; // Default to 1 if not valid

    if (product) {
      for (let i = 0; i < quantity; i++) {
        cart.push(product);
      }
      updateCartDisplay(); // Update the cart display
      alert(`${product.name} added to cart with quantity ${quantity}!`);
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
      // Group cart items by product
      const groupedItems = cart.reduce((acc, product) => {
        if (!acc[product.id]) {
          acc[product.id] = { ...product, quantity: 0 };
        }
        acc[product.id].quantity += 1;
        return acc;
      }, {});

      const cartContent = Object.values(groupedItems).map(item => `
        <div id="cart-item-${item.id}">
          <h4>${item.name} x
            <input type="number" id="cart-quantity-${item.id}" value="${item.quantity}" min="1" onchange="updateItemQuantity(${item.id})" />
          </h4>
          <p>Price: ${item.price * item.quantity}</p>
          <button onclick="removeItem(${item.id})">Remove Item</button>
        </div>
      `).join('');
      cartItems.innerHTML = cartContent;
    }
  };

  // Function to update item quantity
  window.updateItemQuantity = (productId) => {
    const quantityInput = document.getElementById(`cart-quantity-${productId}`);
    const newQuantity = parseInt(quantityInput.value, 10) || 1;

    // Find and update the quantity in the cart
    const itemIndex = cart.findIndex(p => p.id === productId);
    if (itemIndex !== -1) {
      // Remove all current instances of the product
      cart = cart.filter(p => p.id !== productId);

      // Add new instances according to the new quantity
      for (let i = 0; i < newQuantity; i++) {
        cart.push(products.find(p => p.id === productId));
      }
      updateCartDisplay(); // Update the cart display
    }
  };

  // Function to remove an item completely from the cart
  window.removeItem = (productId) => {
    cart = cart.filter(p => p.id !== productId); // Remove all instances of the item
    updateCartDisplay(); // Update the cart display
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
      // Remove or adjust according to your payment
