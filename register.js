const BACKEND_BASE_URL = "https://library-portal-backend-production.up.railway.app";
const AUTH_API = `${BACKEND_BASE_URL}/api/auth`;


// 1) Wait until the HTML is fully loaded
document.addEventListener("DOMContentLoaded", function () {

    // 2) Get the form element
    const registerForm = document.getElementById("registerForm");

    // 3) Attach "submit" event handler
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // stop normal form submit (page reload)

        // 4) Read values from the form
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const role = document.getElementById("role").value;

        // 5) Simple front-end validation
        if (!name || !email || !password || !confirmPassword || !role) {
            alert("Please fill all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Password and Confirm Password do not match.");
            return;
        }

        // 6) Build the request body exactly like your auth-service expects
        const requestBody = {
            name: name,
            email: email,
            password: password,
            role: role
        };

        try {
            // 7) Call your backend: POST /api/student/auth/register
            const response = await fetch(`${AUTH_API}/register`, {

                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            // 8) Handle response
            if (response.ok) {
                // Registration success
                alert("Registration successful! Please login.");

                // 9) Redirect to login page
                window.location.href = "index.html"; // your login page
            } else {
                // Try to read error message from backend
                let errorText = "Registration failed.";
                try {
                    const errorBody = await response.json();
                    if (errorBody && errorBody.message) {
                        errorText = errorBody.message;
                    }
                } catch (e) {
                    // ignore JSON parse error, keep default message
                }
                alert(errorText);
            }

        } catch (error) {
            console.error("Error calling backend:", error);
            alert("Could not connect to server. Is the auth-service running?");
        }
    });
});
