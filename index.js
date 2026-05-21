import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import db from './db.js';

const typeDefs = `#graphql
    type Query {
        returnString(string: String): String!
        justString: [String!]

        # whole databases 
        reviews: [Review!]
        games: [Game!]
        authors: [Author!]

        # single item
        review(id: ID!): [Review!]!
        author(id: ID!): [Author!]
    }

    type Review {
        id: ID!
        rating: Int!
        content: String!
        author_id: ID!
        game_id: ID!
        games_by_game_id: [Game!]
        author_by_author_id: [Author!]!
    }

    type Game {
        id: ID!
        title: String!
        platforms: [String!]!
        iteration_console: String
        game_reviews: [Review!]!
    }

    type Author {
        id: ID!
        name: String!
        verified: Boolean!
        authors_reviews: [Review!]!
    }

    type Mutation {
        deleteGameByGameId(id: ID!): [Game!]!
        addGame(gameObject: GameObject!): [Game!]!
        updateGamesPlatformsByGameId(id: ID!, platforms: [String!]!): [Game!]!
    }

    input GameObject {
        id: ID!
        title: String!
        platforms: [String!]!
    }
`;

const resolvers = {
    Query: {
        returnString: (parent, args) => {
            console.log('query: returnString');
            return args.string;
        },
        justString: () => {
            console.log('query: justString');
            return ['hello from just string'];
        },
        reviews: () => {
            console.log('query: reviews');
            return db.reviews;
        },
        games: () => {
            console.log('query: games');
            return db.games;
        },
        authors: () => {
            console.log('query: authors');
            return db.authors;
        },
        review: (parent, args, context) => {
            console.log('============================');
            console.log('query: review');
            console.log('args: ', args);
            return db.reviews.filter(review => review.id === args.id);
        },
        author: (parent, args, context) => {
            console.log('============================');
            console.log('query: author');
            console.log('args: ', args);
            return db.authors.filter(author => author.id === args.id);
        }
    },
    Game: {
        iteration_console: (parent) => {
            console.log('============================');
            console.log('iteration_console triggered', parent);
            return;
        },
        game_reviews: (parent, args, context) => {
            console.log('---------------------------------');
            console.log('Game: game_reviews');
            console.log('parent: ', parent);
            return db.reviews.filter(review => review.game_id === parent.id);
        }
    },
    Author: {
        authors_reviews: (parent, args) => {
            console.log('---------------------------------');
            console.log('Author: authors_reviews');
            console.log('parent: ', parent);
            return db.reviews.filter(review => review.author_id === parent.id);
        }
    },
    Review: {
        games_by_game_id: (parent, args) => {
            console.log('---------------------------------');
            console.log('Review: games_by_game_id');
            console.log('parent: ', parent);
            return db.games.filter(game => game.id === parent.game_id);
        },
        author_by_author_id: (parent, args) => {
            console.log('---------------------------------');
            console.log('Review: author_by_author_id');
            console.log('parent: ', parent);
            return db.authors.filter(author => author.id === parent.author_id);
        }
    },
    Mutation: {
        deleteGameByGameId: (parent, args) => {
            console.log('---------------------------------');
            console.log('Mutation: deleteGameByGameId');
            console.log('args: ', args);
            db.games = db.games.filter(game => game.id !== args.id);
            return db.games;
        },
        addGame: (parent, args) => {
            console.log('---------------------------------');
            console.log('Mutation: addGame');
            console.log('args: ', args);
            db.games.push({
                id: args.gameObject.id,
                title: args.gameObject.title,
                platforms: args.gameObject.platforms
            });
            return db.games;
        },
        updateGamesPlatformsByGameId: (parent, args) => {
            console.log('---------------------------------');
            console.log('Mutation: updateGamesPlatformsByGameId');
            console.log('args: ', args);
            db.games = db.games.map(game => {
                if (game.id === args.id) {
                    return { ...game, platforms: args.platforms };
                }
                return game;
            });
            return db.games;
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

console.log(`Server ready at ${url}`);

// String, Boolean, Int, ID, Float
