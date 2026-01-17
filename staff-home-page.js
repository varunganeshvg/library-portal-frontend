document.addEventListener("DOMContentLoaded", function () {

    // 1. Read login data
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    const staffName = localStorage.getItem("userName");

    // 2. Basic login check
    if (!token || !role) {
        alert("Please login first");
        window.location.href = "index.html";
        return;
    }

    // 3. Role check
    if (role !== "ROLE_STAFF") {
        alert("Access denied. Staff only.");
        window.location.href = "index.html";
        return;
    }

    // 4. Show staff name
    if (staffName) {
        document.getElementById("staffName").textContent = staffName;
    }
});

/* ===== Navigation functions ===== */

function openProfile() {
    window.location.href = "staff-profile.html";
}

function goUpload() {
    window.location.href = "staff-upload-books.html";
}

function goBooks() {
    window.location.href = "staff-books.html";
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

function goUpdate(){
   window.location.href="staff-update-books.html";
}