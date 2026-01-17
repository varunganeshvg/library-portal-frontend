const BACKEND_BASE_URL = "https://library-portal-backend-production.up.railway.app";
const BOOKSERVICE_BASE_URL = "https://library-portal-bookservice-production.up.railway.app";

const ADMIN_API = `${BOOKSERVICE_BASE_URL}/api/admin`;

const BOOK_API  = `${BOOKSERVICE_BASE_URL}/api/books`;


document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("authToken");
    const role  = localStorage.getItem("userRole");

    if (!token || role !== "ROLE_ADMIN") {
        alert("Access denied");
        window.location.href = "index.html";
        return;
    }

    loadAllBooks();
});

/* ================= LOAD ALL BOOKS ================= */

async function loadAllBooks() {

    const token = localStorage.getItem("authToken");

    const res = await fetch(`${ADMIN_API}/books/all`, {
        headers: { "Authorization": "Bearer " + token }
    });

    const books = await res.json();
    renderBooks(books);
}

/* ================= SEARCH ================= */

async function searchBooks() {

    const token = localStorage.getItem("authToken");
    const query = document.getElementById("searchInput").value.trim();

    if (query === "") {
        loadAllBooks();
        return;
    }

    const res = await fetch(
        `${BOOK_API}/search?query=${query}`,
        {
            headers: { "Authorization": "Bearer " + token }
        }
    );

    const books = await res.json();
    renderBooks(books);
}

/* ================= RENDER ================= */

function renderBooks(books) {

    const body = document.getElementById("booksBody");
    body.innerHTML = "";

    if (books.length === 0) {
        body.innerHTML =
            `<tr><td colspan="8">No books found</td></tr>`;
        return;
    }

    books.forEach(book => {
        body.innerHTML += `
            <tr>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.category}</td>
                <td>${book.course}</td>
                <td>${book.section}</td>
                <td>${book.semester}</td>
                <td>${book.uploadedAt ?? "-"}</td>
                <td>
                    <button class="delete-btn"
                        onclick="deleteBook(${book.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

/* ================= DELETE ================= */

async function deleteBook(id) {

    if (!confirm("Delete this book?")) return;

    const token = localStorage.getItem("authToken");

    await fetch(
        `${BOOK_API}/delete/${id}`,
        {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
        }
    );

    loadAllBooks();
}

function goBack() {
    window.location.href = "admin-home.html";
}