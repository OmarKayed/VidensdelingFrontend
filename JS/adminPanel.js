const apiBaseUrl = "http://localhost:8080/api/auth";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch(`${apiBaseUrl}/current-user`);
        if (response.ok) {
            const userData = await response.json();

            if (userData.userType !== "ADMIN") {
                window.location.href = "knowledgeIndex.html";
                return;
            }

            document.getElementById("admin-panel").style.display = "block"; 
            loadUsers();
        } else {
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("Error checking user:", error);
        window.location.href = "login.html";
    }

    document.getElementById("createUserForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const userData = {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
            email: document.getElementById("email").value,
            userType: document.getElementById("userType").value,
            department: document.getElementById("department").value,
        };

        try {
            const response = await fetch(`${apiBaseUrl}/add-user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                alert("Bruger oprettet!");
                document.getElementById("createUserForm").reset();
                loadUsers();
            } else {
                const errorText = await response.text();
                document.getElementById("error-message").innerText = errorText;
            }
        } catch (error) {
            console.error("Fejl i at skabe brugeren:", error);
            document.getElementById("error-message").innerText =
                "En fejl opstod under oprettelse af brugeren.";
        }
    });
});

async function loadUsers() {
    try {
        const response = await fetch(`${apiBaseUrl}/all`);
        if (response.ok) {
            const users = await response.json();
            const usersTable = document.getElementById("usersTable");
            usersTable.innerHTML = "";

            users.forEach((user) => {
                const department = user.department === "P_D" ? "P&D" : user.department; // Transform P_D to P&D

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.userType}</td>
                    <td>${department}</td> 
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editUser('${user.username}')">Rediger</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.username}')">Slet</button>
                    </td>
                `;
                usersTable.appendChild(row);
            });
        } else {
            alert("Kunne ikke hente brugere.");
        }
    } catch (error) {
        console.error("Kunne ikke hente brugere:", error);
    }
}

async function deleteUser(username) {
    try {
        const response = await fetch(`${apiBaseUrl}/delete-user`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }), 
        });

        if (response.ok) {
            alert("Bruger slettet.");
            loadUsers(); // Refresh the user list
        } else {
            const errorText = await response.text();
            alert(`Fejl: ${errorText}`); // Show an error message if deletion fails
        }
    } catch (error) {
        console.error("Fejl ved sletning af bruger:", error); // Show any errors in the console
    }
}

async function editUser(username) {
    const newUsername = prompt("Indtast det nye brugernavn (lad være blank for at beholde det nuværende):");
    const newEmail = prompt("Indtast den nye email (lad være blank for at beholde det nuværende):");
    const newUserType = prompt("Indtast den nye rolle (USER eller ADMIN, lad være blank for at beholde det nuværende):");
    const newDepartment = prompt("Indtast den nye afdeling (IT, ØKONOMI, JURISTISK, P&D, lad være blank for at beholde det nuværende):");

    // Update the user information
    const updatedUser = {
        username, // Original username 
        newUsername: newUsername || null,
        email: newEmail || null,
        userType: newUserType || null,
        department: newDepartment || null,
    };

    try {
        // Send the updated user information to the backend
        const response = await fetch(`${apiBaseUrl}/edit-user`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
        });

        if (response.ok) {
            alert("Brugeren blev opdateret!");
            loadUsers(); // Refresh the user list
        } else {
            const errorText = await response.text();
            alert(`Fejl ved opdatering af bruger: ${errorText}`); // Show an error message
        }
    } catch (error) {
        console.error("Fejl ved redigering af bruger:", error); // Log the error
    }
}