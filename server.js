var { ApolloServer } = require('@apollo/server');
var { startStandaloneServer } = require('@apollo/server/standalone');
var {schema} = require('./Schema/schema');
var {resolvers} = require("./Resolver/resolvers");

// Creating server
async function startServer() {
    const server = new ApolloServer({ 
        typeDefs: schema, 
        resolvers,
        includeStacktraceInErrorResponses: false
    });
    const { url } = await startStandaloneServer(server, {
    listen: { port: 4001 },
    });
    console.log(`Server up and running at ${url}`);
}
module.exports = {
    startServer
}