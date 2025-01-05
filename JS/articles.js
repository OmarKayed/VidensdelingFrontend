document.addEventListener("DOMContentLoaded", async () => {
    const articlesContainer = document.getElementById("articles-container");
    const apiBaseUrl = "http://localhost:8080/api/knowledge";
    const authBaseUrl = "http://localhost:8080/api/auth"; 

    async function fetchArticles() {
        try {
            const response = await fetch(`${apiBaseUrl}/articles`);
            if (!response.ok) throw new Error("Fejl ved hentning af artikler.");

            const articles = await response.json();
            articlesContainer.innerHTML = ""; // Clear the container

            // Check if the user is an admin
            const isAdmin = await checkIfAdmin();

            articles.forEach(article => {
                const articleElement = createArticleElement(article, isAdmin);
                articlesContainer.appendChild(articleElement);
            });
        } catch (error) {
            console.error("Fejl ved hentning af artikler:", error);
            articlesContainer.innerHTML = `<p class="text-danger">Kunne ikke hente artikler. Prøv igen senere.</p>`;
        }
    }

    async function checkIfAdmin() {
        try {
            const response = await fetch(`${authBaseUrl}/current-user`);
            if (!response.ok) throw new Error("Kunne ikke hente brugeroplysninger.");
            const user = await response.json();
            return user.userType === "ADMIN"; // Check if the user is an admin
        } catch (error) {
            console.error("Fejl ved kontrol af brugerrettigheder:", error);
            return false;
        }
    }

    function createArticleElement(article, isAdmin) {
        const articleElement = document.createElement("div");
        articleElement.classList.add("list-group-item");

        articleElement.innerHTML = `
            <p class="mb-1"><strong>${article.title}</strong></p>
            <p class="article-description">${article.description}</p>
            <div class="article-actions d-flex justify-content-end">
                <a href="viewArticle.html?title=${encodeURIComponent(article.title)}" class="btn btn-secondary btn-sm me-2">Se</a>
                ${
                    isAdmin
                        ? `
                    <a href="editArticle.html?title=${encodeURIComponent(article.title)}&description=${encodeURIComponent(article.description)}" 
                       class="btn btn-warning btn-sm me-2">Rediger</a>
                    <button class="btn btn-danger btn-sm delete-button" data-title="${article.title}">Slet</button>
                    `
                        : ""
                }
            </div>
        `;

        if (isAdmin) {
            articleElement.querySelector(".delete-button").addEventListener("click", async (e) => {
                const title = e.target.dataset.title;
                if (confirm(`Er du sikker på at du vil fjerne denne artikel: ${title}?`)) {
                    try {
                        const response = await fetch(`${apiBaseUrl}/articles/${encodeURIComponent(title)}`, {
                            method: "DELETE",
                        });
                        if (!response.ok) throw new Error("Kunne ikke slette artiklen.");
                        alert("Artiklen blev slettet.");
                        fetchArticles();
                    } catch (error) {
                        console.error("Fejl ved sletning af artiklen:", error);
                        alert("Kunne ikke slette artiklen. Prøv igen.");
                    }
                }
            });
        }

        return articleElement;
    }

    fetchArticles();
});