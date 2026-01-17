document.addEventListener("DOMContentLoaded", function () {

    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    const adminName = localStorage.getItem("userName");

    // Auth check
    if (!token || !role) {
        alert("Please login first");
        window.location.href = "index.html";
        return;
    }

    // Role check
    if (role !== "ROLE_ADMIN") {
        alert("Access denied");
        window.location.href = "index.html";
        return;
    }

    // Set dashboard title dynamically
    if (adminName) {
        document.getElementById("dashboardTitle").textContent =
            adminName + "'s Dashboard";
    }
});

/* ===== Navigation ===== */

function goStaff() {
    window.location.href = "admin-staff.html";
}

function goStudents() {
    window.location.href = "admin-students.html";
}

function goAssign() {
    window.location.href = "admin-assign-staff.html";
}

function goBooks() {
    window.location.href = "admin-books.html";
}

function openProfile() {
    window.location.href = "admin-profile.html";
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}
