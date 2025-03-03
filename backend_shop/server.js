const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/products', (req, res) => {
    fs.readFile('products.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Ошибка чтения файла'});
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.use(express.static('../frontend'));

app.listen(PORT, () => {
    console.log(`Сервер каталога запущен на http://localhost:${PORT}`);
})