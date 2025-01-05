async function askQuestion() {
    const userInput = document.getElementById("userInput").value;
    const responseContainer = document.getElementById("responseContainer");

    try {
        // Call the AI Search endpoint with a POST request and JSON body
        const response = await fetch("http://localhost:8080/api/ai/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userInput: userInput, // Pass the query as userInput
            }),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Display the search results
        if (data.length === 0) {
            responseContainer.style.display = "block";
            responseContainer.innerHTML = `<p>Ingen relevante artikler fundet</p>`;
        } else {
            responseContainer.style.display = "block";
            responseContainer.innerHTML = data
                .map(
                    (article) => `
                    <div class="search-result">
                        <h4>${article.title || "No title"}</h4>
                        <p>${article.description || "No description"}</p>
                    </div>
                `
                )
                .join("");
        }
    } catch (error) {
        responseContainer.style.display = "block";
        responseContainer.textContent = "En fejl opstod. Kontakt venligst Helpdesk.";
        console.error(error);
    }
}