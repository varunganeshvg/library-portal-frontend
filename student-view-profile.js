document.addEventListener("DOMContentLoaded", async function () {

    // 1️⃣ Read required values from localStorage
    const authToken = localStorage.getItem("authToken");
    const userEmail = localStorage.getItem("userEmail");
    const userRole  = localStorage.getItem("userRole");

    // 2️⃣ Basic protection checks
    if (!authToken || !userEmail || !userRole) {
        alert("Please login first");
        window.location.href = "index.html";
        return;
    }

    if (userRole !== "ROLE_STUDENT") {
        alert("Access denied. Students only.");
        window.location.href = "index.html";
        return;
    }

    try {
        // 3️⃣ Call backend to GET student profile
       const response = await fetch(
  "https://library-portal-bookservice-production.up.railway.app/api/student/profile"

  {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + authToken
    }
  }
);


        if (!response.ok) {
            alert("Failed to load profile");
            return;
        }

        // 4️⃣ Convert response JSON → JavaScript object
        const profile = await response.json();

        // 5️⃣ Display values on the page (VIEW ONLY)
        document.getElementById("profileName").textContent     = profile.name;
        document.getElementById("profileEmail").textContent    = profile.email;
        document.getElementById("profileCourse").textContent   = profile.course;
        document.getElementById("profileSection").textContent  = profile.section;
        document.getElementById("profileSemester").textContent = profile.semester;
        document.getElementById("profileRollNo").textContent   = profile.rollNo;

    } catch (error) {
        console.error(error);
        alert("Server error. Is book-service running?");
    }
});

// 6️⃣ Home button function
function goHome() {
    window.location.href = "student-home.html";
}