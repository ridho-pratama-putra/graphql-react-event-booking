const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
});

app.use(isAuth);

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);
// mongodb+srv://ridho:<password>@cluster0-tyuir.mongodb.net/test?retryWrites=true&w=majority
// mongoose
//     .connect(
//         `mongodb+srv://${process.env.MONGO_USER}:${
//             process.env.MONGO_PASSWORD
//             }@cluster0-tyuir.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, {useNewUrlParser: true}
//     )
//     .then(() => {
//         app.listen(8000);
//     })
//     .catch(err => {
//         console.log(err);
//     });

mongoose
  .connect(
    'mongodb://localhost:27017/events-react-dev', { useNewUrlParser: true ,  useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(8000)
  })
  .catch(err => {
    console.log(err)
  });
