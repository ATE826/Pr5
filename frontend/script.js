document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3000/products")
        .then(response => response.json())
        .then(products => {
            const container = document.getElementById("products");
            products.forEach(product => {
                const card = document.createElement("div");
                card.innerHTML = `
                    <h2>${product.name}</h2>
                    <p>Цена: ${product.price} руб.</p>
                    <p>${product.description}</p>
                    <p>Категории: ${product.categories.join(", ")}</p>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => console.error("Ошибка загрузки товаров:", error));
});
