const graphql = require('graphql');
const fetch = require('isomorphic-fetch');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList
} = graphql;

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return fetch(`http://localhost:3000/companies/${parentValue.id}/users`).then(res => res.json())
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return fetch(`http://localhost:3000/companies/${parentValue.companyId}`).then(res => res.json())
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return fetch(`http://localhost:3000/users/${args.id}`).then(res => res.json())
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return fetch(`http://localhost:3000/companies/${args.id}`).then(res => res.json())
      }
    },
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});