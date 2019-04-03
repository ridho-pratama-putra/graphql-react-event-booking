const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();
app.use(bodyParser.json());
app.listen(3000);

app.get('/',(req, res, next) => {
    // console.log('yayay')
    res.send('yayaya');
});

app.use('/graphiql',graphqlHttp({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }
        type RootMutation {
            createEvent(name: String): String
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return ['a','b','c'];
        },
        createEvent: (args) => {
            const eventName = args.name;
            return args;
            // return eventName;
        }
    },
    graphiql: true
}));