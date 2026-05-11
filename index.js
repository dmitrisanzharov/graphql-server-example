import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import _db from './_db.js';

const typeDefs = `#graphql 
    type Game {
        id: ID!
        title: String!
        platforms: [String!]!
    }

    type Review {
        id: ID!
        rating: Int!
        content: String!
    }

    type Author {
        id: ID!
        name: String!
        verified: Boolean!
    }

    type Query {
        reviews: [Review]
        games: [Game]
        authors: [Author]
    }
`;


const resolvers = {
    Query: {
        games(){
            return _db.games;
        },
        reviews(){
            return _db.reviews;
        },
        authors(){
            return _db.authors;
        }
    }
}


const server = new ApolloServer({
    typeDefs,
    resolvers
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`Server ready at port: ` + 4000);

