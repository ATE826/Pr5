// Импорт модулей
const express = require('express'); // Подключаем фреймворк Express.js
const fs = require('fs'); // Подключаем модуль для работы с файловой системой
const cors = require('cors'); // Подключаем middleware для обработки CORS-запросов

// Создание сервера
const app = express(); // Создаём экземпляр приложения Express
const PORT = 8080; // Определяем порт, на котором будет работать сервер
app.use(express.json()); // Позволяет серверу работать с JSON-данными в запросах
app.use(cors()); // Разрешает кросс-доменные запросы

// Функция для получения списка товаров из файла products.json
const getProducts = () => {
    return JSON.parse(fs.readFileSync('../backend_shop/products.json', 'utf8'));
};

// Функция для сохранения обновлённого списка товаров в файл products.json
const saveProducts = (products) => {
    fs.writeFileSync('../backend_shop/products.json', JSON.stringify(products, null, 2));
};

// Маршрут для добавления новых товаров (POST /products)
app.post('/products', (req, res) => {
    const products = getProducts(); // Получаем текущий список товаров
    const newProducts = req.body; // Получаем массив новых товаров из тела запроса
    
    // Добавляем новые товары в массив
    newProducts.forEach(product => products.push(product));
    
    saveProducts(products); // Сохраняем обновлённый список товаров в файл
    res.status(201).json({ message: 'Товары добавлены'}); // Отправляем ответ с кодом 201 (Created)
});

// Маршрут для обновления товара по ID (PUT /products/:id)
app.put('/products/:id', (req, res) => {
    let products = getProducts(); // Получаем текущий список товаров
    const productId = parseInt(req.params.id); // Получаем ID товара из параметра запроса и преобразуем в число
    const index = products.findIndex(p => p.id === productId); // Находим индекс товара в массиве
    
    // Если товар не найден, отправляем ошибку 404
    if (index === -1) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    // Обновляем товар, перезаписывая его свойства новыми данными из запроса
    products[index] = { ...products[index], ...req.body };
    saveProducts(products); // Сохраняем обновлённый список товаров
    res.json({ message: 'Товар обновлён' }); // Отправляем ответ
});

// Маршрут для удаления товара по ID (DELETE /products/:id)
app.delete('/products/:id', (req, res) => {
    let products = getProducts(); // Получаем текущий список товаров
    const productId = parseInt(req.params.id); // Получаем ID товара из параметра запроса и преобразуем в число
    const productExist = products.some(p => p.id === productId); // Проверяем, существует ли товар с таким ID

    // Если товар не найден, отправляем ошибку 404
    if (!productExist){
        return res.status(404).json({message: 'Товар не найден'});
    }

    // Фильтруем массив, оставляя только те товары, у которых ID не совпадает с удаляемым
    products = products.filter(p => p.id !== productId);
    saveProducts(products); // Сохраняем обновлённый список товаров
    res.json({ message: 'Товар удалён' }); // Отправляем ответ
});

// Запуск сервера на указанном порту
app.listen(PORT, () => {
    console.log(`Админ-панель запущена на http://localhost:${PORT}/products`);
});
