import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import _db from './_db.js';

// query.firstPrimitive localhost 4000 -> apollo explorer

const typeDefs = `#graphql  

    type Query {
        firstPrimitive: String!
        myObjQuery: MyObj!
    }

    type MyObj {
        name: String!
        title: String!
        newProp: Int
    }

`;

const resolvers = {
    Query: {
        firstPrimitive: () => 'first Primitive String',
        myObjQuery: () => ({})
        
    },
    MyObj: {
        name: () => 'mario',
        title: () => 'plumber',
        newProp: () => 42
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const apollo = await startStandaloneServer(server, {
    listen: { port: 4000 }
});
