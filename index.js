import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import _db from './_db.js';


const port = 4000;

const typeDefs = `#graphql 

    type Query {
        fooStr: String!
    }


`;

const resolvers = {
    Query: {
        fooStr: () => 'omg it worked'
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const { url } = await startStandaloneServer(server, {
    listen: { port: port }
});

console.log(`Server ready at port: ` + port);
