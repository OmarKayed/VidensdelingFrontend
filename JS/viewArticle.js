document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const articleTitle = urlParams.get("title");
    const articleContentDiv = document.getElementById("articleContent");

    if (!articleTitle) {
        articleContentDiv.innerHTML = "<p class='text-danger'>Ingen artikel fundet.</p>";
        return;
    }

    try {
        // Fetch the article content from the backend
        const response = await fetch(`http://localhost:8080/api/knowledge/articles/${encodeURIComponent(articleTitle)}`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const article = await response.json();

        // Display the article
        articleContentDiv.innerHTML = `
            <h2>${article.title}</h2>
            <p>${article.description}</p>
        `;
    } catch (error) {
        console.error(error);
        articleContentDiv.innerHTML = "<p class='text-danger'>Kunne ikke hente artiklen. Prøv igen senere.</p>";
    }
});