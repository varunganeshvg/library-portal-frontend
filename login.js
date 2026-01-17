// login.js
const BACKEND_BASE_URL = "https://library-portal-backend-production.up.railway.app";
const AUTH_API = `${BACKEND_BASE_URL}/api/auth`;

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    // When the form is submitted
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // stop normal page reload

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Simple check
        if (email === "" || password === "") {
            alert("Please enter both email and password.");
            return;
        }

        // Build request body
        const loginRequest = {
            email: email,
            password: password
        };

        // Call AuthService (port 8080)
        fetch(`${AUTH_API}/login`, {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginRequest)
        })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Login failed. Check email or password.");
            }
            return response.json();
        })
        .then(function (data) {
            console.log("Login response:", data);

            const token = data.token;
            const role  = data.role;
            const name  = data.name;
            const userId = data.id;

            if (!token || !role) {
                alert("Login success, but token/role missing in response.");
                return;
            }

            // Save values for later pages
            localStorage.setItem("authToken", token);
            localStorage.setItem("userRole", role);
            localStorage.setItem("userName", name);
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userId",userId);
             

            // Redirect based on role
           if (role === "ROLE_STUDENT") {
    window.location.href = "student-home.html";
            }
            else if (role === "ROLE_STAFF") {
                window.location.href = "staff-home.html";
            } else if (role === "ROLE_ADMIN") {
                window.location.href = "admin-home.html";
            } else {
                alert("Unknown role: " + role);
            }
        })
        .catch(function (error) {
            console.error("Error during login:", error);
            alert(error.message);
        });

    });

});
