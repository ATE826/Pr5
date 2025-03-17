document.addEventListener("DOMContentLoaded", () => {  // Ждём полной загрузки страницы
    // Отправляем GET-запрос к серверу для получения списка товаров
    fetch("http://localhost:3000/products")
        .then(response => response.json()) // Преобразуем ответ сервера в JSON
        .then(products => {
            const container = document.getElementById("products"); // Получаем контейнер для отображения товаров
            
            products.forEach(product => {
                const card = document.createElement("div"); // Создаём div для карточки товара
                
                // Заполняем карточку товара данными из JSON
                card.innerHTML = `
                    <table class="table">
                        <h2>${product.name}</h2>
                        <p>Цена: ${product.price} руб.</p>
                        <p>${product.description}</p>
                        <p>Категории: ${product.categories.join(", ")}</p>

                        <div class="d-flex justify-content-center"><button class="btn-warning">Заказать</button></div>
                    </table>
                `;
                
                container.appendChild(card); // Добавляем карточку товара в контейнер
            });
        })
        .catch(error => console.error("Ошибка загрузки товаров:", error)); // Выводим ошибку в консоль, если запрос не удался
});
