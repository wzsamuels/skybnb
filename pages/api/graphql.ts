import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag';
import prisma from "../../lib/prisma";
import {schema} from "../../graphql/schema"

const server = new ApolloServer({
  schema
});

export default startServerAndCreateNextHandler(server, {
  context: async (req, res) => ({ req, res, prisma }),
});