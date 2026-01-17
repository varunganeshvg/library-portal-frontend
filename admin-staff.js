const BACKEND_BASE_URL = "https://library-portal-bookservice-production.up.railway.app";

const API_BASE = `${BACKEND_BASE_URL}/api/staff`;

document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "ROLE_ADMIN") {
        alert("Access denied");
        window.location.href = "index.html";
        return;
    }

    loadStaff();
});

function goBack() {
    window.location.href = "admin-home.html";
}

/* ===== Load Staff ===== */
async function loadStaff() {

    const token = localStorage.getItem("authToken");

    const response = await fetch(`${API_BASE}/list`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const staffList = await response.json();
    const table = document.getElementById("staffTable");

    // Clear old rows (keep header)
    table.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Code</th>
            <th>Actions</th>
        </tr>
    `;

    staffList.forEach(staff => {
        table.innerHTML += `
            <tr>
                <td>${staff.name}</td>
                <td>${staff.email}</td>
                <td>${staff.department}</td>
                <td>${staff.staffCode}</td>
                <td>
    <button class="edit-btn" onclick="editStaff(${staff.id}, this)">Edit</button>
    <button class="delete-btn" onclick="deleteStaff(${staff.id})">Delete</button>
</td>
            </tr>
        `;
    });
}

/* ===== Add Staff ===== */
async function addStaff() {

    const token = localStorage.getItem("authToken");

    const staff = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        department: document.getElementById("department").value,
        staffCode: document.getElementById("staffCode").value
    };

    const response = await fetch(`${API_BASE}/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(staff)
    });

    if (response.ok) {
        alert("Staff added");
        loadStaff();
    } else {
        alert("Failed to add staff");
    }
}

/* ===== Delete Staff ===== */
async function deleteStaff(id) {

    const token = localStorage.getItem("authToken");

    if (!confirm("Are you sure you want to delete this staff?")) return;

    await fetch(`${API_BASE}/delete/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    loadStaff();
}

function editStaff(id, btn) {

    const row = btn.closest("tr");
    const cells = row.querySelectorAll("td");

    const name = cells[0].innerText;
    const department = cells[2].innerText;
    const staffCode = cells[3].innerText;

    cells[0].innerHTML = `<input value="${name}">`;
    cells[2].innerHTML = `<input value="${department}">`;
    cells[3].innerHTML = `<input value="${staffCode}">`;

    cells[4].innerHTML = `
        <button class="edit-btn" onclick="saveStaff(${id}, this)">Save</button>
        <button class="delete-btn" onclick="loadStaff()">Cancel</button>
    `;
}

async function saveStaff(id, btn) {

    const row = btn.closest("tr");
    const inputs = row.querySelectorAll("input");

    const updatedStaff = {
        name: inputs[0].value,
        department: inputs[1].value,
        staffCode: inputs[2].value
    };

    const token = localStorage.getItem("authToken");

    const response = await fetch(
    `${API_BASE}/update/${id}`,

        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(updatedStaff)
        }
    );

    if (response.ok) {
        alert("Staff updated");
        loadStaff();
    } else {
        alert("Update failed");
    }
}
