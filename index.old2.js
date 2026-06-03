import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import _db from './_db.js';

const typeDefs = `#graphql 
    type Query {
        foo: Game!
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
        reviews: [Reviews!]
        blah: String
    }

    type Reviews {
        id: ID!
        rating: Int!
        content: String!
        game_id: ID!
        author_id: ID!
        author: Author!
        singleGame: Game!
    }

    type Author {
        id: ID!
        name: String!
        verified: Boolean!
        firstReview: Reviews!
    }
`;

const resolvers = {
    Query: {
        foo: () => ({ id: '1', title: 'Zelda, Tears of the Kingdom', platforms: ['Switch'] }),
        reviews: () => _db.reviews,
        games: () => _db.games,
        authors: () => _db.authors,
        varReturn: (parent, args) => args.varStr,
        singleReview: (parent, args) => {

            console.log('args in singleReview', args.id)

            return _db.reviews.filter(review => review.id === args.id)
        },
        singleGame: (parent, args) => _db.games.filter(game => game.id === args.singleGameId)
    },
    Game: {
        reviews: (parent) => _db.reviews.filter(review => review.game_id === parent.id),
        blah: () => 'blah blah'
    },
    Author: {
        firstReview: (parent) => _db.reviews.find(review => review.author_id === parent.id)
    },
    Reviews: {
        author: (parent) => _db.authors.find(author => author.id === parent.author_id),
        singleGame: (parent) => _db.games.find(game => game.id === parent.game_id)
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













