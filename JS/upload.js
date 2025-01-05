document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.getElementById("uploadForm");
    const uploadStatus = document.getElementById("uploadStatus");
    const apiUrl = "http://localhost:8080/api/knowledge/upload";

    uploadForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const title = document.getElementById("articleTitle").value;
        const description = document.getElementById("articleDescription").value;

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description }),
            });

            if (response.ok) {
                uploadStatus.textContent = "Artikel uploadet!";
                uploadStatus.classList.add("text-success");
            } else {
                const errorMessage = await response.text();
                uploadStatus.textContent = errorMessage;
                uploadStatus.classList.add("text-danger");
            }
        } catch (error) {
            console.error("Fejl i uploade artikel", error);
            uploadStatus.textContent = "An error occurred. Please try again.";
            uploadStatus.classList.add("text-danger");
        }
    });
});