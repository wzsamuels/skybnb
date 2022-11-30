import {asNexusMethod, makeSchema} from 'nexus'
import { join } from 'path'
import * as types from './types'
import { DateTimeResolver } from 'graphql-scalars';

// Allows t.datetime() for
const DateTime = asNexusMethod(DateTimeResolver, 'datetime');

export const schema = makeSchema({
  types: [
    DateTime,
    types
  ],
  outputs: {
    typegen: join(process.cwd(), 'node_modules', '@types', 'nexus-typegen', 'index.d.ts'),
    schema: join(process.cwd(), 'graphql', 'schema.graphql'),
  },
  contextType: {
    export: 'Context',
    module: join(process.cwd(), 'graphql', 'context.ts'),
  },
})