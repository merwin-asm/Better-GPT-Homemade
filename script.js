// Event listener for "openChatBtn"
document.getElementById("openChatBtn")?.addEventListener("click", () => {
  if (!localStorage.getItem("authToken")) {
    window.location.href = "login.html";
  } else {
    window.location.href = "chat.html";
  }
});

document.getElementById("menu-button").addEventListener("click", function () {
  var menu = document.getElementById("mobile-menu");
  menu.classList.toggle("hidden");
});

function showVerifyForm() {
  if (validateLoginForm()) {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("verifyForm").style.display = "flex";
  }
}

function validateVerifyForm() {
  const verificationCode = document.getElementById("verificationCode").value;
  const verifyError = document.getElementById("verifyError");
  const email = document.getElementById("email").value;

  fetch("http://localhost:8000/login_code", {
    method: "GET",
    headers: {
      "x-email-id": email,
      "x-code": verificationCode,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const apiKey = data["ret"];
      if (apiKey.includes("incorrect")) {
        verifyError.style.display = "block";
        return false;
      } else {
        // Store API key in localStorage
        localStorage.setItem("authToken", apiKey);
        verifyError.style.display = "none";
        window.location.href = "chat.html";
        return true;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Validate email in login form
function validateLoginForm() {
  const email = document.getElementById("email").value;
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const loginError = document.getElementById("loginError");

  if (emailPattern.test(email)) {
    loginError.style.display = "none";

    // Login email req
    fetch("http://localhost:8000/login", {
      method: "GET",
      headers: {
        "x-email-id": email,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error === "err sending email") {
          loginError.style.display = "block";
          return false;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    return true;
  } else {
    loginError.style.display = "block";
    return false;
  }
}

// Update the auth button based on token
function updateAuthButton() {
  const authButtonContainer = document.getElementById("authButtonContainer");
  const mobileAuthButtonContainer = document.getElementById("mobileAuthButtonContainer");
  const openChatBtn = document.getElementById("openChatBtn");
  const token = localStorage.getItem("authToken");

  if (token) {
    authButtonContainer.innerHTML = `
      <a href="#" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full" onclick="logout()">Logout</a>
    `;
    mobileAuthButtonContainer.innerHTML = `
      <a href="#" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full" onclick="logout()">Logout</a>
    `;
    openChatBtn.innerHTML = `
      <div class="flex space-x-4">
        <button id="openChatBtn" class="btn">
          <svg height="24" width="24" fill="#FFFFFF" viewBox="0 0 24 24">
            <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
          </svg>
          <span class="text">Open Chat</span>
        </button>
      </div>
    `;
  } else {
    authButtonContainer.innerHTML = `
      <a href="login.html" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Login</a>
    `;
    mobileAuthButtonContainer.innerHTML = `
      <a href="login.html" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Login</a>
    `;
    openChatBtn.innerHTML = `
      <div class="flex space-x-4">
        <button id="openChatBtn" class="btn">
          <svg height="24" width="24" fill="#FFFFFF" viewBox="0 0 24 24">
            <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
          </svg>
          <span class="text">LOGIN</span>
        </button>
      </div>
    `;
  }
}



// Handle logout functionality
function logout() {
  fetch("http://localhost:8000/logout", {
    method: "GET",
    headers: {
      "x-api-key": localStorage.getItem("authToken"),
    },
  })
    .then(() => {
      console.log("logged out..");
    })
    .catch((error) => {
      console.error("Error during logout:", error);
    });

  localStorage.removeItem("authToken");
  window.location.href = "index.html";
  updateAuthButton();
  // Redirect to login page after logout
}

updateAuthButton();
