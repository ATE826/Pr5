const express = require('express');
const fs = require('fs');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');

const app = express();
const PORT = 3000;

app.use(cors());

// Получение продуктов
const GetProducts = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('products.json', 'utf8', (err, data) => {
            if (err) {
                reject('Ошибка чтения файла');
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
};

// GraphQL-схема
const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        price: { type: GraphQLString },
        description: { type: GraphQLString },
    }),
});

// RootQuery определяет, что будет доступно через GraphQL-запросы
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        products: {
            type: new GraphQLList(ProductType),
            resolve(parent, args) {
                return GetProducts();  // Возвращает список продуктов из файла
            },
        },
    },
});

// Схема GraphQL
const schema = new GraphQLSchema({
    query: RootQuery,
});

// Настройка маршрута для GraphQL
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true, // Интерфейс для тестирования запросов
}));

// Маршрут для получения продуктов через REST
app.get('/products', (req, res) => {
    GetProducts()
        .then(products => res.json(products))
        .catch(err => res.status(500).json({ error: err }));
});

app.use(express.static('../frontend'));

app.listen(PORT, () => {
    console.log(`Сервер каталога запущен на http://localhost:${PORT}`);
});
