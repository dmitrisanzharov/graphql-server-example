import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import _db from './_db.js';

const PORT = 4000;

const typeDefs = `#graphql 

    type Mutation {
        addGame(gameObj: GameInput!): [Game!]
        deleteGame(id: ID!): [Game!]
        updateGame(id: ID!, titleArg: String): [Game!]
    }

    input GameInput {
        title: String!
        platforms: [String!]!
    }

    type Query {
        foo: String!
        games: [Game!]!
        allReviews: [Review!]!
        authors: [Author!]
        fooWithVars(fooVar: String!): String!
        singleReview(reviewId: ID!,): Review
        qryWithArgs(argFromTypeDef1: String!, argFromTypeDef2: String!): [String!]
        singleGame(id: ID!): Game
        singleAuthor(id: ID!): Author
        returnMyObj: MyObj!
    }

    type MyObj{
        foo: String!
        extraValue: String
    }

    type Game {
        id: ID!
        title: String!
        platforms: [String!]!
        anyKey: String
        reviews: [Review!]
    }

    type Review {
        id: ID!
        rating: Int!
        content: String!
        game_id: ID!
        author_id: ID!
        game: Game!
        author: Author!
        firstAuthorByReviewId: Author!
        firstGameByReviewGameId: Game
        someRandomJazz: String
        doesNotExist: String
    }

    type Author {
        id: ID!
        name: String!
        verified: Boolean!
        authorReviewByAuthorId: [Review!]!
    }

`;

const resolvers = {
    Mutation: {
        addGame: (_, args) => {
            console.log('mutation triggered args', args);
            _db.games.push({ ...args.gameObj, id: Math.random().toString() + 'a' });
            return _db.games
        },
        deleteGame: (_, args) => {
            console.log('mutation triggered args', args);
            _db.games = _db.games.filter((game) => game.id !== args.id);
            return _db.games
        },
        updateGame: (_, args) => {
            _db.games = _db.games.map((game) => {
                if (game.id === args.id) {
                    return { ...game, title: args.titleArg };
                }
                return game;
            })
            return _db.games
        }
    },
    Query: {
        foo: () => {
            console.log('foo triggered');
            return 'bar'
        },
        returnMyObj: () => ({}),
        games: () => _db.games,
        allReviews: () => _db.reviews,
        authors: () => _db.authors,
        fooWithVars: (_, args) => args.fooVar,
        singleReview: (_, args) => {
            console.log('args', args);
            return _db.reviews.find((review) => review.id === args.reviewId)
        },
        singleGame: (_, args) => {
            console.log('args', args);
            return _db.games.find((game) => game.id === args.id)
        },
        qryWithArgs: (_, args) => {
            console.log('args in qryWithArgs', args);
            return [args.argFromTypeDef1, args.argFromTypeDef2]
        },
        singleAuthor: (_, args) => {
            console.log('args', args);
            return _db.authors.find((author) => author.id === args.id)
        }
    },
    MyObj: {
        extraValue: (parent) => {
            console.log('parent', parent);
            return 'extraValue'
        },
        foo: () => 'foo'
    },
    Review: {
        game: (parent) => {
            console.log('parent', parent);
            return _db.games.find((game) => game.id === parent.game_id);
        },
        author: (parent) => {
            console.log('parent', parent);
            return _db.authors.find((author) => author.id === parent.author_id);
        },
        firstAuthorByReviewId: (parent) => {
            console.log('parent', parent);
            return _db.authors.find((author) => author.id === parent.author_id);
        },
        firstGameByReviewGameId: (parent) => {
            console.log('parent', parent);
            return _db.games.find((game) => game.id === parent.game_id);
        },
        someRandomJazz: () => {
            console.log('jazz')
            return 'jazz'
        }
    },
    Game: {
        reviews: (parent) => {
            console.log('parent', parent);
            return _db.reviews.filter((review) => review.game_id === parent.id);
        }
    },
    Author: {
        authorReviewByAuthorId: (parent) => {
            console.log('parent', parent);
            return _db.reviews.filter((review) => review.author_id === parent.id);
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const { url } = await startStandaloneServer(server, {
    listen: { port: PORT }
});

console.log(`Server ready at port: ` + PORT);
