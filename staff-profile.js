const AUTH_API  = "https://library-portal-backend-production.up.railway.app/api/auth";
const STAFF_API = "https://library-portal-bookservice-production.up.railway.app/api/staff";


document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("authToken");
    const role  = localStorage.getItem("userRole");

    if (!token || role !== "ROLE_STAFF") {
        alert("Access denied");
        window.location.href = "index.html";
        return;
    }

    loadAuthProfile();
    loadStaffProfile();
});

/* ===== Auth Service Profile ===== */
async function loadAuthProfile() {

    const token = localStorage.getItem("authToken");

    const res = await fetch(`${AUTH_API}/profile`, {
        headers: { "Authorization": "Bearer " + token }
    });

    if (!res.ok) {
        alert("Failed to load auth profile");
        return;
    }

    const user = await res.json();

    document.getElementById("name").textContent  = user.name;
    document.getElementById("email").textContent = user.email;
    document.getElementById("role").textContent  = user.role;
}

/* ===== Book Service Staff Profile ===== */
async function loadStaffProfile() {

    const token = localStorage.getItem("authToken");

    const res = await fetch(`${STAFF_API}/profile`, {
        headers: { "Authorization": "Bearer " + token }
    });

    if (!res.ok) {
        alert("Failed to load staff details");
        return;
    }

    const staff = await res.json();

    document.getElementById("department").textContent = staff.department;
    document.getElementById("staffCode").textContent  = staff.staffCode;
}

function goBack() {
    window.location.href = "staff-home.html";
}