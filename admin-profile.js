const BACKEND_BASE_URL = "https://library-portal-bookservice-production.up.railway.app";
const AUTH_API = `${BACKEND_BASE_URL}/api/admin`;


document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    // Basic access check
    if (!token || role !== "ROLE_ADMIN") {
        alert("Access denied");
        window.location.href = "index.html";
        return;
    }

    loadProfile();
});

async function loadProfile() {

    const token = localStorage.getItem("authToken");

    try {
       const response = await fetch(`${AUTH_API}/profile`, {

            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) {
            alert("Failed to load profile");
            return;
        }

        const user = await response.json();

        // Fill data into page
        document.getElementById("name").textContent = user.name;
        document.getElementById("email").textContent = user.email;
        document.getElementById("role").textContent = user.role;

    } catch (error) {
        console.error(error);
        alert("Error loading profile");
    }
}

function goBack() {
    window.location.href = "admin-home.html";
}