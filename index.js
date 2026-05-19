import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';




const typeDefs = `#graphql
    type Query {

    }
`;



const server = new ApolloServer({
    // typeDefs,
    // resolverFunctions
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

// String, Boolean, Int, ID, Float