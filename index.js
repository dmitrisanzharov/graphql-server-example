import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import _db from './_db.js';

const typeDefs = `#graphql 
    type Query {
        foo: String
        reviews: [Reviews!]!
        games: [Game!]!
        authors: [Author!]!
        varReturn(varStr: String!): String!
        singleReview(id: ID!): [Reviews!]!
        singleGame(singleGameId: ID!): [Game!]!
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
        authors: () => _db.authors,
        varReturn: (parent, args) => args.varStr,
        singleReview: (parent, args) => {

            console.log('args in singleReview', args.id)

            return _db.reviews.filter(review => review.id === args.id)
        },
        singleGame: (parent, args) => _db.games.filter(game => game.id === args.singleGameId)
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const apollo = await startStandaloneServer(server, {
    listen: { port: 4000 }
});

console.log('============================');
console.log(`Server ready at: ${apollo.url}`);
// console.log(`Server ready at port: ` + 4000);













