const BACKEND_BASE_URL = "https://library-portal-bookservice-production.up.railway.app";

const STAFF_API = `${BACKEND_BASE_URL}/api/staff`;
document.addEventListener("DOMContentLoaded", async function () {

    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    const staffName = localStorage.getItem("userName");

    // 1️⃣ Basic auth check
    if (!token || role !== "ROLE_STAFF") {
        alert("Access denied. Staff only.");
        window.location.href = "index.html";
        return;
    }

    // 2️⃣ Show staff name
    if (staffName) {
        document.getElementById("staffName").textContent = staffName;
    }

    // 3️⃣ Load assigned classes
    loadAssignedClasses(token);
});

async function loadAssignedClasses(token) {

    try {
        const response = await fetch(
    `${STAFF_API}/assignments`,

            {
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to load assignments");
        }

        const assignments = await response.json();
        const grid = document.getElementById("classGrid");

        grid.innerHTML = "";

        // 4️⃣ No assignments case
        if (assignments.length === 0) {
            grid.innerHTML = "<p>No classes assigned yet.</p>";
            return;
        }

        // 5️⃣ Render class cards
        assignments.forEach(a => {
            const card = document.createElement("div");
            card.className = "class-card";

            card.innerHTML = `
                <h3>${a.course} - ${a.section}</h3>
                <p><strong>Semester:</strong> ${a.semester}</p>
                <p><strong>Subject:</strong> ${a.subjectName}</p>
               <button onclick="goManage('${a.course}', '${a.section}', ${a.semester})">
    Manage Books
</button>
            `;

            grid.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        alert("Error loading assigned classes");
    }
}

/* ===== Navigation ===== */

function goManage(course, section, semester) {
    window.location.href =
        `staff-upload-books.html?course=${course}&section=${section}&semester=${semester}`;
}

function openProfile() {
    window.location.href = "staff-profile.html";
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}