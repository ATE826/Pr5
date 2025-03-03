const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 8080;
app.use(express.json());
app.use(cors());

const getProducts = () => {
    return JSON.parse(fs.readFileSync('../backend_shop/products.json', 'utf8'));
};

const saveProducts = (products) => {
    fs.writeFileSync('../backend_shop/products.json', JSON.stringify(products, null, 2));
};

app.post('/products', (req, res) => {
    const products = getProducts();
    const newProducts = req.body;
    newProducts.forEach(product => products.push(product));
    saveProducts(products);
    res.status(201).json({ message: 'Товары добавлены'});
});

app.put('/products/:id', (req, res) => {
    let products = getProducts();
    const productId = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === productId);
    if (index === -1) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    products[index] = { ...products[index], ...req.body };
    saveProducts(products);
    res.json({ message: 'Товар обновлён' });
});

app.delete('/products/:id', (req, res) => {
    let products = getProducts();
    const productId = parseInt(req.params.id);
    products = products.filter(p => p.id !== productId);
    saveProducts(products);
    res.json({ message: 'Товар удалён' });
});

app.listen(PORT, () => {
    console.log(`Админ-панель запущена на http://localhost:${PORT}`);
});