let allBooks = [];

/* ================= PAGE LOAD ================= */

document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "ROLE_STUDENT") {
        alert("Please login as student");
        window.location.href = "index.html";
        return;
    }

    // Load profile
    const profileRes = await fetch(
        "https://library-portal-bookservice-production.up.railway.app/api/student/profile",
        {
            headers: { "Authorization": "Bearer " + token }
        }
    );

    if (profileRes.status === 404) {
        window.location.href = "student-profile-setup.html";
        return;
    }

    const profile = await profileRes.json();
    document.getElementById("studentName").textContent = profile.name;

    // Load subjects
    loadSubjects();
});

/* ================= SUBJECTS ================= */

async function loadSubjects() {

    const token = localStorage.getItem("authToken");

    const res = await fetch(
      "https://library-portal-bookservice-production.up.railway.app/api/student/subjects",

        {
            headers: { "Authorization": "Bearer " + token }
        }
    );

    const subjects = await res.json();
    const container = document.getElementById("subjectsContainer");
    container.innerHTML = "";

    subjects.forEach(s => {
        const div = document.createElement("div");
        div.style.border = "1px solid #ccc";
        div.style.padding = "15px";
        div.style.marginBottom = "10px";
        div.style.background = "white";

        div.innerHTML = `
            <h3>${s.subjectName}</h3>
            <p><strong>Staff:</strong> ${s.staffName}</p>
            <button onclick="viewBooks(${s.staffUserId})">View Books</button>
        `;

        container.appendChild(div);
    });
}

/* ================= BOOKS ================= */

async function viewBooks(staffUserId) {

    document.getElementById("subjectsSection").style.display = "none";
    document.getElementById("booksSection").style.display = "block";

    const token = localStorage.getItem("authToken");

    const res = await fetch(
        `https://library-portal-bookservice-production.up.railway.app/api/student/books/by-staff/${staffUserId}`,
        {
            headers: { "Authorization": "Bearer " + token }
        }
    );

    if (!res.ok) {
        alert("Failed to load books");
        return;
    }

    allBooks = await res.json();
    renderBooks(allBooks);
}

function renderBooks(books) {

    const tbody = document.getElementById("booksBody");
    tbody.innerHTML = "";

    if (books.length === 0) {
        tbody.innerHTML =
            `<tr><td colspan="5">No books found</td></tr>`;
        return;
    }

    books.forEach(book => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.category}</td>
            <td>${book.uploadedAt ? book.uploadedAt.split("T")[0] : "-"}</td>
            <td><a href="${book.downloadLink}" target="_blank">Download</a></td>
        `;
        tbody.appendChild(row);
    });
}

/* ================= SEARCH (INSIDE SUBJECT ONLY) ================= */

function searchBooks() {

    const query = document.getElementById("searchInput").value.toLowerCase();

    if (query === "") {
        renderBooks(allBooks);
        return;
    }

    const filtered = allBooks.filter(b =>
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query) ||
        b.category.toLowerCase().includes(query)
    );

    renderBooks(filtered);
}

/* ================= NAV ================= */

function goBackToSubjects() {
    document.getElementById("booksSection").style.display = "none";
    document.getElementById("subjectsSection").style.display = "block";
}

function openProfile() {
    window.location.href = "student-view-profile.html";
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}