// Load registered users from localStorage or start empty array
let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

// Helper validation functions
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(number) {
  return /^(\+91|0)?[6-9][0-9]{9}$/.test(number);
}

// Toggle password visibility
function togglePassword() {
  const password = document.getElementById("password");
  const toggle = document.querySelector(".toggle-password");
  if (password.type === "password") {
    password.type = "text";
    toggle.textContent = "Hide Password";
  } else {
    password.type = "password";
    toggle.textContent = "Show Password";
  }
}

// Show Login form and hide others
function goToLogin() {
  document.getElementById("loginBox").style.display = "block";
  document.getElementById("forgotPasswordBox").style.display = "none";
  document.getElementById("successPage").style.display = "none";
  document.getElementById("registerBox").style.display = "none";
  clearMessages();
}

// Show Register form and hide others
function goToRegister() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("forgotPasswordBox").style.display = "none";
  document.getElementById("successPage").style.display = "none";
  document.getElementById("registerBox").style.display = "block";
  clearMessages();
}

// Show Forgot Password form and hide others
function goToForgotPassword() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("forgotPasswordBox").style.display = "block";
  document.getElementById("successPage").style.display = "none";
  document.getElementById("registerBox").style.display = "none";
  clearMessages();
}

// Clear all error and success messages
function clearMessages() {
  document.getElementById("usernameError").textContent = "";
  document.getElementById("passwordError").textContent = "";
  document.getElementById("searchError").textContent = "";
  const searchMessage = document.getElementById("searchMessage");
  if (searchMessage) searchMessage.textContent = "";
  const registerError = document.getElementById("registerError");
  if (registerError) registerError.textContent = "";
}

// LOGIN FORM SUBMIT
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  clearMessages();

  let valid = true;

  if (!username || (!isValidEmail(username) && !isValidPhone(username))) {
    document.getElementById("usernameError").textContent = "The email address or mobile number you entered isn't valid.";
    valid = false;
  }

  if (!password) {
    document.getElementById("passwordError").textContent = "Please enter your password.";
    valid = false;
  }

  if (!valid) return;

  // Check if user exists and password matches
  const user = registeredUsers.find(u => u.emailOrPhone === username);

  if (!user) {
    document.getElementById("usernameError").textContent = "No account found with this email or phone number.";
    return;
  }

  if (user.password !== password) {
    document.getElementById("passwordError").textContent = "Incorrect password. Please try again.";
    return;
  }

  // Successful login
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("successPage").style.display = "block";
});

// REGISTRATION FORM SUBMIT
document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const regName = document.getElementById("regName").value.trim();
  const regEmail = document.getElementById("regEmail").value.trim();
  const regPassword = document.getElementById("regPassword").value.trim();
  const registerError = document.getElementById("registerError");

  registerError.textContent = "";

  if (!regName) {
    registerError.textContent = "Please enter your full name.";
    return;
  }
  if (!regEmail || (!isValidEmail(regEmail) && !isValidPhone(regEmail))) {
    registerError.textContent = "Please enter a valid email or mobile number.";
    return;
  }
  if (!regPassword) {
    registerError.textContent = "Please enter a password.";
    return;
  }

  // Check if already registered
  const alreadyRegistered = registeredUsers.some(user => user.emailOrPhone === regEmail);
  if (alreadyRegistered) {
    registerError.textContent = "You are already registered with this email or phone. Please log in.";
    return;
  }

  // Save new user
  registeredUsers.push({
    name: regName,
    emailOrPhone: regEmail,
    password: regPassword
  });
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

  alert("Registration successful! You can now log in.");
  document.getElementById("registerForm").reset();
  goToLogin();
});

// FORGOT PASSWORD FORM SUBMIT
document.getElementById("forgotForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const search = document.getElementById("search").value.trim();
  const searchError = document.getElementById("searchError");
  let searchMessage = document.getElementById("searchMessage");

  if (!searchMessage) {
    // If <p id="searchMessage"></p> is missing, create and add it under the form
    searchMessage = document.createElement("p");
    searchMessage.id = "searchMessage";
    searchMessage.style.marginTop = "10px";
    document.getElementById("forgotPasswordBox").appendChild(searchMessage);
  }

  searchError.textContent = "";
  searchMessage.textContent = "";

  if (!search || (!isValidEmail(search) && !isValidPhone(search))) {
    searchError.textContent = "Please enter a valid email address or mobile number.";
    return;
  }

  // Reload users from localStorage just in case
  registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

  const found = registeredUsers.some(user => user.emailOrPhone === search);

  if (found) {
    searchMessage.style.color = "#2ecc71"; // green
    searchMessage.textContent = "We've found your account! Please check your email or phone for password reset instructions.";
  } else {
    searchMessage.style.color = "#e74c3c"; // red
    searchMessage.textContent = "No account found with that email or phone number. Please try again.";
  }
});
