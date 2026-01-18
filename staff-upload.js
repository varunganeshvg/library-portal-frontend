let course, section, semester;
let editingBookId = null;

document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "ROLE_STAFF") {
        alert("Access denied");
        window.location.href = "index.html";
        return;
    }

    const params = new URLSearchParams(window.location.search);
    course = params.get("course");
    section = params.get("section");
    semester = params.get("semester");

    if (!course || !section || !semester) {
        alert("Invalid class details");
        return;
    }

    document.getElementById("classInfo").value =
        `${course} - ${section} (Semester ${semester})`;

    loadBooks();
});

/* ================= LOAD BOOKS ================= */

async function loadBooks() {

    const token = localStorage.getItem("authToken");

  const res = await fetch(
  `https://library-portal-bookservice-production.up.railway.app/api/staff/books/class
?course=${course}&section=${section}&semester=${semester}`,
  {
    headers: {
      "Authorization": "Bearer " + token
    }
  }
);

    const books = await res.json();
    const body = document.getElementById("booksBody");

    body.innerHTML = "";

    if (books.length === 0) {
        body.innerHTML =
            `<tr><td colspan="4">No books uploaded yet</td></tr>`;
        return;
    }

    books.forEach(book => {
        body.innerHTML += `
            <tr>
              <td>${book.title}</td>
              <td>${book.author}</td>
              <td>${book.category}</td>
              <td>
                <button onclick="editBook(${book.id}, '${book.title}', '${book.author}', '${book.category}', '${book.downloadLink}')">
                  Edit
                </button>
                <button onclick="deleteBook(${book.id})">
                  Delete
                </button>
              </td>
            </tr>
        `;
    });
}

/* ================= UPLOAD / UPDATE ================= */

async function uploadBook() {

    const token = localStorage.getItem("authToken");

    const bookData = {
        title: document.getElementById("title").value.trim(),
        author: document.getElementById("author").value.trim(),
        category: document.getElementById("category").value.trim(),
        downloadLink: document.getElementById("downloadLink").value.trim(),
        course,
        section,
        semester: parseInt(semester)
    };

    if (!bookData.title || !bookData.author || !bookData.downloadLink) {
        alert("Fill all required fields");
        return;
    }

   let url = "https://library-portal-bookservice-production.up.railway.app/api/books/add";

    let method = "POST";

    if (editingBookId) {
       url = `https://library-portal-bookservice-production.up.railway.app/api/books/update/${editingBookId}`;

        method = "PUT";
    }

    const res = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(bookData)
    });

    if (!res.ok) {
        alert("Operation failed");
        return;
    }

    clearForm();
    loadBooks();
}

/* ================= EDIT ================= */

function editBook(id, title, author, category, link) {

    editingBookId = id;

    document.getElementById("title").value = title;
    document.getElementById("author").value = author;
    document.getElementById("category").value = category;
    document.getElementById("downloadLink").value = link;
}

/* ================= DELETE ================= */

async function deleteBook(id) {

    if (!confirm("Delete this book?")) return;

    const token = localStorage.getItem("authToken");

    await fetch(
        `https://library-portal-bookservice-production.up.railway.app/api/books/delete/${id}`,

        {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
        }
    );

    loadBooks();
}

/* ================= HELPERS ================= */

function clearForm() {
    editingBookId = null;
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("category").value = "";
    document.getElementById("downloadLink").value = "";
}

function goBack() {
    window.location.href = "staff-home.html";
}