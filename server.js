var express = require('express');
var {graphqlHTTP} = require('express-graphql');
var {schema} = require('./Schema/schema');
var {root} = require("./Resolver/resolvers");
var {errorType} = require("./util/ErrorMessages");

const app = express();
const port  = Number.parseInt(process.env.PORT) || 4000
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
    formatError: (err) => {
        const error = errorType[err.message];
        return ({message: error.message, statusCode: error.statusCode})
    }
}));
app.listen(port, () => console.log('DAIAPI Server up and running'));
module.exports= {
    app
}
