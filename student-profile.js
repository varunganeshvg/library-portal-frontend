document.addEventListener("DOMContentLoaded",function() {

    const profileForm=document.getElementById("studentProfileForm");
   
    const userName= localStorage.getItem("userName");
    const userEmail=localStorage.getItem("userEmail");
    const userRole=localStorage.getItem("userRole");

    const authToken=localStorage.getItem("authToken");
    if(!authToken||!userRole){
    
    alert("you are not logged in , please log in first");
    window.location.href="index.html";
    return;

    }

    if(userRole!= "ROLE_STUDENT"){

    alert("this page is only for students");
    window.location.href="index.html";
    return;

    }
    const nameInput= document.getElementById("name");
    if(userName && nameInput)
    {
      nameInput.value=userName;
     }
    const emailInput = document.getElementById("email");
    if(userEmail&& emailInput)
    {
      emailInput.value=userEmail;
    }

    profileForm.addEventListener("submit",async function(event)
    {
     event.preventDefault();

   
   
    const name = document.getElementById("name").value.trim();
    
    const course = document.getElementById("course").value.trim();
    const section = document.getElementById("section").value.trim();
    const semester = document.getElementById("semester").value.trim();
    const rollNo = document.getElementById("rollNo").value.trim();

    if(!name||!course||!section||!semester||!rollNo)
    {
       alert("Please fill all the details");
       return;
    }

    const semesterNumber = parseInt(semester, 10);
        if (isNaN(semesterNumber) || semesterNumber <= 0) {
            alert("Semester must be a positive number (1, 2, 3, ...).");
            return;
        }

        // 9) Build request body exactly like StudentDetails expects
        const requestBody = {
            name: name,
            course: course,
            section: section,
            semester: semesterNumber,
            rollNo: rollNo
        };

        // 10) Prepare headers (JSON + optional Authorization)
        const headers = {
            "Content-Type": "application/json"
        };
        if (authToken) {
            headers["Authorization"] = "Bearer " + authToken;
        }

        try {
            // 11) Call backend book-service (port 8081)
            const response = await fetch("https://library-portal-bookservice-production.up.railway.app/api/student/profile", {
                method: "POST",
                headers: headers,
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                // Try to read error from backend
                let message = "Failed to save profile.";
                try {
                    const errorBody = await response.json();
                    if (errorBody && errorBody.message) {
                        message = errorBody.message;
                    }
                } catch (e) {
                    // Ignore JSON parse error
                }
                alert(message);
                return;
            }
 const savedProfile = await response.json();
            console.log("Profile saved:", savedProfile);

            alert("Profile saved successfully!");
          
             

            // 13) Go to student home page
            window.location.href = "student-home.html";

        } catch (error) {
            console.error("Error while saving profile:", error);
            alert("Could not connect to server. Is book-service running on port 8081?");
        }

    });

});




