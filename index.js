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
        # full
        reviews: [Review]
        games: [Game]
        authors: [Author]

        # with vars
        review(id: ID!): Review
        author(name: String!): Author
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
        },

        // singles
        review(parent, args, context){
           console.log(args.id);
           return _db.reviews.find(review => review.id === args.id);
        },

        author(_, args){
            console.log('args', args)
            return _db.authors.find(author => author.name === args.name);
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