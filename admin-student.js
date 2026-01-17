const BACKEND_BASE_URL = "https://library-portal-bookservice-production.up.railway.app";

const ADMIN_API = `${BACKEND_BASE_URL}/api/admin`;

document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("authToken");
    const role  = localStorage.getItem("userRole");

    if (!token || role !== "ROLE_ADMIN") {
        alert("Access denied");
        window.location.href = "index.html";
        return;
    }

    loadStudents();
});

async function loadStudents() {

    const token = localStorage.getItem("authToken");

    try {
        const res = await fetch(`${ADMIN_API}/students`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!res.ok) {
            alert("Failed to load students");
            return;
        }

        const students = await res.json();
        const tbody = document.getElementById("studentsBody");

        tbody.innerHTML = "";

        if (students.length === 0) {
            tbody.innerHTML =
                `<tr><td colspan="6">No students found</td></tr>`;
            return;
        }

        students.forEach(s => {
            tbody.innerHTML += `
                <tr>
                    <td>${s.name}</td>
                    <td>${s.email}</td>
                    <td>${s.course}</td>
                    <td>${s.section}</td>
                    <td>${s.semester}</td>
                    <td>${s.rollNo}</td>
                </tr>
            `;
        });

    } catch (err) {
        console.error(err);
        alert("Server error while loading students");
    }
}

function goBack() {
    window.location.href = "admin-home.html";
}