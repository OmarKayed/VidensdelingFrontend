document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const articleTitle = urlParams.get("title");
    const articleDescription = urlParams.get("description");
    const apiBaseUrl = "http://localhost:8080/api/knowledge";
    const editForm = document.getElementById("editArticleForm");
    const editStatus = document.getElementById("editStatus");

    document.getElementById("articleTitle").value = articleTitle;
    document.getElementById("articleDescription").value = articleDescription;

    editForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const updatedTitle = document.getElementById("articleTitle").value;
        const updatedDescription = document.getElementById("articleDescription").value;

        try {
            const response = await fetch(`${apiBaseUrl}/articles/${encodeURIComponent(articleTitle)}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: updatedTitle,
                    description: updatedDescription,
                }),
            });

            if (response.ok) {
                editStatus.textContent = "Artiklen blev opdateret.";
                editStatus.classList.add("text-success");
                setTimeout(() => {
                    window.location.href = "ITviden.html";
                }, 1500);
            } else {
                editStatus.textContent = "Kunne ikke opdatere artiklen.";
                editStatus.classList.add("text-danger");
            }
        } catch (error) {
            console.error("Fejl under opdatering af artiklen:", error);
            editStatus.textContent = "Der opstod en fejl. Prøv igen.";
            editStatus.classList.add("text-danger");
        }
    });
});