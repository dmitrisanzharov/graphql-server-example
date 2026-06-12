import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import _db from './_db.js';


const port = 4000;

const typeDefs = `#graphql 

    type Query {
        fooStr: String!
        sayHi: String!
        reviewsArr: [Review!]!
        authorsArr: [Author!]!
        gamesArr: [Game!]!
        singleGameById(id: ID!): Game!
        authorById(id: ID!): Author
    }

    type Game {
        id: ID!
        title: String!
        platforms: [String!]!
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
        thisAuthorsReviews: [Review!]!
    }




`;

const resolvers = {
    Query: {
        fooStr: () => 'omg it worked',
        sayHi: () => 'hi',
        reviewsArr: () => _db.reviews,
        authorsArr: () => _db.authors,
        gamesArr: () => _db.games,
        singleGameById: (parent, args) => {
            return _db.games.find(game => game.id === args.id)
        },
        authorById: (parent, args) => {
            return _db.authors.find(author => author.id === args.id)
        }
    },
    Author: {
        thisAuthorsReviews: (parent) => {
            return _db.reviews.filter(review => review.author_id === parent.id)
        }
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
