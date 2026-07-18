import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import _db from './_db.js';

const PORT = 4000;

const typeDefs = `#graphql 

    type Query {
        foo: String!
        games: [Game!]!
        reviews: [Review!]!
        authors: [Author!]
        fooWithVars(fooVar: String!): String!
        singleReview(reviewId: ID!,): Review
        qryWithArgs(argFromTypeDef1: String!, argFromTypeDef2: String!): [String!]
    }

    type Game {
        id: ID!
        title: String!
        platforms: [String!]!
        anyKey: String
    }

    type Review {
        id: ID!
        rating: Int!
        content: String!
        game_id: ID!
        author_id: ID!
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
        games: () => _db.games,
        reviews: () => _db.reviews,
        authors: () => _db.authors,
        fooWithVars: (_, args) => args.fooVar,
        singleReview: (_, args) => {
            console.log('args', args);
            return _db.reviews.find((review) => review.id === args.reviewId)
        },
        qryWithArgs: (_, args) => {
            console.log('args in qryWithArgs', args);
            return [args.argFromTypeDef1, args.argFromTypeDef2]
        }
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const { url } = await startStandaloneServer(server, {
    listen: { port: PORT }
});

console.log(`Server ready at port: ` + PORT);
