document.addEventListener("DOMContentLoaded", async () => {
    const loginLink = document.getElementById("loginLink");
    const vidensdelingLink = document.querySelector('a[href="knowledgeIndex.html"]');
    const apiBaseUrl = "http://localhost:8080/api/auth";

    // Check if the user is logged in
    try {
        const response = await fetch(`${apiBaseUrl}/current-user`);
        if (response.ok) {
            const userData = await response.json();
            console.log(`Logged in as: ${userData.username}`);

            // Update login link to show username
            loginLink.textContent = userData.username;
            loginLink.href = "#";
            loginLink.addEventListener("click", (e) => {
                e.preventDefault();
                if (confirm("Vil du logge ud?")) {
                    fetch(`${apiBaseUrl}/logout`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }).then(() => {
                        alert("Logged ud!");
                        location.reload();
                    });
                }
            });

            // Show the Vidensdeling link
            vidensdelingLink.style.display = "inline";

        } else {
            console.log("Ingen bruger logget ind.");
            loginLink.textContent = "Login";
            loginLink.href = "login.html";

            // Hide the Vidensdeling link
            vidensdelingLink.style.display = "none";
        }
    } catch (error) {
        console.error("Følgende fejl:", error);
        vidensdelingLink.style.display = "none"; // Hide Vidensdeling link in case of error
    }

    // Handle login form submission
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const username = document.getElementById("usernameField").value;
            const password = document.getElementById("passwordField").value;

            try {
                const response = await fetch(`${apiBaseUrl}/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password,
                    }), // Convert data to JSON
                });

                if (response.ok) {
                    const data = await response.text();
                    alert(data);
                    location.href = "knowledgeIndex.html"; // Redirect the user to knowledgeIndex after login
                } else {
                    const errorText = await response.text();
                    const messageDiv = document.getElementById("message");
                    messageDiv.textContent = errorText; // Show error message
                }
            } catch (error) {
                console.error("Fejl under login:", error);
                const messageDiv = document.getElementById("message");
                messageDiv.textContent = "En fejl opstod. Prøv igen senere.";
            }
        });
    }
});