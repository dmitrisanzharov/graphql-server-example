import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import _db from './_db.js';

const typeDefs = `#graphql 
    type Query {
        foo: String
        reviews: [Reviews!]!
        games: [Game!]!
        authors: [Author!]!
    }

    type Game {
        id: ID!
        title: String!
        platforms: [String!]!
    }

    type Reviews {
        id: ID!
        rating: Int!
        content: String!
    }

    type Author {
        id: ID!
        name: String!
        verified: Boolean!
    }
`;

const resolvers = {
    Query: {
        foo: () => 'bar',
        reviews: () => _db.reviews,
        games: () => _db.games,
        authors: () => _db.authors
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const apollo = await startStandaloneServer(server, {
    listen: { port: 4000 }
});
console.log('apollo', apollo);

// console.log('============================');
// console.log(`Server ready at: ${url}`);
// console.log(`Server ready at port: ` + 4000);













