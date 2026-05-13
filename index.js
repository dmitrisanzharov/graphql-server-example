import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import _db from './_db.js';

const typeDefs = `#graphql 

    type Review {
        id: ID!
        rating: Int!
        content: String!
        game_id: ID!
        author_id: ID!
        game: Game!
        author: Author!
    }
    
    type Game {
        id: ID!
        title: String!
        platforms: [String!]!
        reviews: [Review!]
    }

    type Author {
        id: ID!
        name: String!
        verified: Boolean!
        reviews: [Review!]
    }

    type Query {
        # full
        reviews: [Review]
        games: [Game]
        authors: [Author]

        # with vars
        review(id: ID!): Review
        author(name: String!): Author
        game(id: ID!): Game
    }

    type Mutation {
        deleteGame(id: ID!): [Game]
        addGame(game: AddGameInput!): [Game]
        updateGame(id: ID!, gameObj: UpdateGameInput!): [Game]
    }

    input AddGameInput {
        id: ID!
        title: String!
        platforms: [String!]!
    }

    input UpdateGameInput {
        title: String!
        platforms: [String!]!
    }
`;

const resolvers = {

    Query: {
        author(_, args) {
            console.log('args', args);
            return _db.authors.find((author) => author.name === args.name);
        },
        games() {
            return _db.games;
        },

        reviews() {
            return _db.reviews;
        },

        authors() {
            return _db.authors;
        },

        // singles
        review(parent, args, context) {
            return _db.reviews.find((review) => review.id === args.id);
        },

        game(parent, args, context) {
            return _db.games.find((game) => game.id === args.id);
        }
    },

    Game: {
        reviews(parent) {
            console.log('parent', parent);
            return _db.reviews.filter((review) => review.game_id === parent.id);
        }
    },

    Author: {
        reviews(parent) {
            console.log('parent', parent);
            return _db.reviews.filter((review) => review.author_id === parent.id);
        }
    },

    Review: {
        game(parent) {
            console.log('parent', parent);
            return _db.games.find((game) => game.id === parent.game_id);
        },

        author(parent) {
            console.log('parent', parent);
            return _db.authors.find((author) => author.id === parent.author_id);
        }
    },

    Mutation: {
        deleteGame(_, args) {
            console.log('mutation triggered args', args);
            _db.games = _db.games.filter((game) => game.id !== args.id);
            return _db.games;
        },
        addGame(_, args) {
            console.log('mutation triggered args', args);
            _db.games.push({ ...args.game, id: Math.random().toString() + 'a' });
            return _db.games;
        },
        updateGame(_, args) {
            _db.games = _db.games.map((game) => {
                if (game.id === args.id) {
                    return { ...game, ...args.gameObj };
                }
                return game;
            })
   
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
});

console.log(`Server ready at port: ` + 4000);
