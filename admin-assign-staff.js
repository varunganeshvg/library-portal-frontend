const BASE_BACKEND_URL = "https://library-portal-bookservice-production.up.railway.app";


const ADMIN_API = `${BASE_BACKEND_URL}/api/admin`;
const STAFF_API = `${BASE_BACKEND_URL}/api/staff`;


document.addEventListener("DOMContentLoaded", () => {

    const role = localStorage.getItem("userRole");
    if (role !== "ROLE_ADMIN") {
        alert("Access denied");
        window.location.href = "index.html";
        return;
    }

    loadStaffDropdown();
    loadAssignments();
});

/* ================= STAFF DROPDOWN ================= */

async function loadStaffDropdown() {

    const token = localStorage.getItem("authToken");

    const res = await fetch(`${STAFF_API}/list`, {
        headers: { Authorization: "Bearer " + token }
    });

    const staffList = await res.json();
    const select = document.getElementById("staffSelect");

    select.innerHTML = "";

    staffList.forEach(staff => {
        select.innerHTML += `
            <option value="${staff.id}">
                ${staff.name} (${staff.staffCode})
            </option>
        `;
    });
}

/* ================= ASSIGN STAFF ================= */

async function assignStaff() {

    const token = localStorage.getItem("authToken");

    const assignment = {
        staffId: document.getElementById("staffSelect").value,
        course: document.getElementById("course").value,
        section: document.getElementById("section").value,
        semester: parseInt(document.getElementById("semester").value),
        subjectName: document.getElementById("subject").value
    };

    const res = await fetch(`${ADMIN_API}/assign`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(assignment)
    });

    if (res.ok) {
        alert("Assignment created");
        loadAssignments();
    } else {
        alert("Assignment failed");
    }
}

/* ================= LOAD ASSIGNMENTS ================= */

async function loadAssignments() {

    const token = localStorage.getItem("authToken");

    const res = await fetch(`${ADMIN_API}/assign/all`, {
        headers: { Authorization: "Bearer " + token }
    });

    const list = await res.json();
    const table = document.getElementById("assignmentTable");

    table.innerHTML = `
        <tr>
            <th>Staff ID</th>
            <th>Course</th>
            <th>Section</th>
            <th>Semester</th>
            <th>Subject</th>
            <th>Action</th>
        </tr>
    `;

    list.forEach(a => {
        table.innerHTML += `
            <tr>
                <td>${a.staffId}</td>
                <td>${a.course}</td>
                <td>${a.section}</td>
                <td>${a.semester}</td>
                <td>${a.subjectName}</td>
                <td>
                    <button class="delete-btn"
                        onclick="deleteAssign(${a.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

/* ================= DELETE ASSIGNMENT ================= */

async function deleteAssign(id) {

    const token = localStorage.getItem("authToken");

    if (!confirm("Delete this assignment?")) return;

    const res = await fetch(`${ADMIN_API}/assign/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token }
    });

    if (res.ok) {
        loadAssignments();
    } else {
        alert("Delete failed");
    }
}

function goBack()
{
window.location.href="admin-home.html";
}
