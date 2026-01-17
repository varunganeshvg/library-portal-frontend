const STUDENT_API = "https://library-portal-bookservice-production.up.railway.app/api/student";

document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("authToken");
    const role  = localStorage.getItem("userRole");
    const name  = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");

    if (!token || role !== "ROLE_STUDENT") {
        alert("Access denied");
        window.location.href = "index.html";
        return;
    }

    document.getElementById("name").value  = name || "";
    document.getElementById("email").value = email || "";

    loadAvailableClasses(token);
});

/* ===== Load dropdown from backend ===== */
async function loadAvailableClasses(token) {

    const res = await fetch(
        `${STUDENT_API}/available-classes`,
        {
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );

    if (!res.ok) {
        alert("Failed to load classes");
        return;
    }

    const classes = await res.json();
    const select = document.getElementById("classSelect");

    classes.forEach(c => {
        const option = document.createElement("option");
        option.value = `${c.course}|${c.section}|${c.semester}`;
        option.textContent =
            `${c.course} - ${c.section} (Sem ${c.semester})`;
        select.appendChild(option);
    });
}

/* ===== Save Profile ===== */
async function saveProfile() {

    const token = localStorage.getItem("authToken");

    const classValue = document.getElementById("classSelect").value;
    const rollNo     = document.getElementById("rollNo").value.trim();

    if (!classValue || !rollNo) {
        alert("Please select class and enter roll number");
        return;
    }

    const [course, section, semester] = classValue.split("|");

    const payload = {
        name: document.getElementById("name").value,
        course: course,
        section: section,
        semester: parseInt(semester),
        rollNo: rollNo
    };

    const res = await fetch(`${STUDENT_API}/profile`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        alert("Failed to save profile");
        return;
    }

    alert("Profile saved successfully!");
    window.location.href = "student-home.html";
}