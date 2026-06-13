import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import _db from './_db.js';


const port = 4000;

const typeDefs = `#graphql 

    type Mutation {
        deleteGameById(gameId: ID!): [Game!]!
        addGame(gameArgs: GameArgs): [Game!]!
        updateGameNameById(gameId: ID!, name: String!): [Game!]!
    }

    input GameArgs {
        title: String!,
        platforms: [String!]!
    }


    type Query {
        fooStr: String!
        sayHi: String!
        reviewsArr: [Review!]!
        authorsArr: [Author!]!
        gamesArr: [Game!]!
        singleGameById(id: ID!): Game!
        authorById(id: ID!): Author
        barObject: Bar
    }

    type Bar {
        name: String
        age: Int
        extraValue: String
    }

    type Game {
        id: ID!
        title: String!
        platforms: [String!]!
        gameReviews: [Review!]
        foo: String
    }

    type Review {
        id: ID!
        rating: Int!
        content: String!
        game_id: ID!
        author_id: ID!
        authorsBasedOnThisReview: Author
    }

    type Author {
        id: ID!
        name: String!
        verified: Boolean!
        thisAuthorsReviews: [Review!]!
    }




`;

const resolvers = {
    Mutation: {
        deleteGameById: (parent, args) => {
            return _db.games.filter(game => game.id !== args.gameId)
        },
        addGame: (patent, args) => {
            console.log('args', args);
            const newGame = { id: `${Math.random().toFixed(2)}`, ...args.gameArgs};
            _db.games.push(newGame);
            return _db.games;
        },
        updateGameNameById: (parent, args) => {
            const {gameId, name} = args; 
            console.log("name: ", name);
            console.log("id: ", gameId);
            return _db.games.map(game => {
                if(game.id === gameId){
                    console.log('triggered')
                    return { ...game, title: name}
                }
                return game
            })
        }
    },
    Query: {
        fooStr: () => 'omg it worked',
        sayHi: () => 'hi',
        reviewsArr: () => _db.reviews,
        authorsArr: () => _db.authors,
        gamesArr: () => {
            console.log('start of loop');
            return _db.games
        },
        singleGameById: (parent, args) => {
            return _db.games.find(game => game.id === args.id)
        },
        authorById: (parent, args) => {
            return _db.authors.find(author => author.id === args.id)
        },
        barObject: () => {
            return { extraValue: 'omg'}
        }
    },
    Bar: {
        name: () => 'bar',
        age: () => 10
    },
    Author: {
        thisAuthorsReviews: (parent) => {
            return _db.reviews.filter(review => review.author_id === parent.id)
        }
    },
    Game: {
        gameReviews: (parent) => {
            console.log('============================');
            console.log('iteration');
            return _db.reviews.filter(review => review.game_id === parent.id)
        }
    },
    Review: {
        authorsBasedOnThisReview: (parent) => {
            return _db.authors.find(author => author.id === parent.author_id)
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
