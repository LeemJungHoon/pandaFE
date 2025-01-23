const orderNumView = document.querySelector('.num');
const orderNumLocal = localStorage.getItem('order-number');

orderNumView.innerHTML += localStorage.getItem("login-token");