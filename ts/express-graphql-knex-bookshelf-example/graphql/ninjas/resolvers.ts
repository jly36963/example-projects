import { GraphQLError } from "graphql";
import { pick } from "lodash";
import { NinjaInsertArgs, NinjaUpdateArgs, NinjaDeleteArgs } from "../../types";

// obj -- previous object
// args -- arguments provided to the field in the GraphQL query
// context -- contextual info (current user, logger, db access)
// info -- field-specific info relevant to current query

export default {
  Mutation: {
    insertNinja: async (_parent, args: NinjaInsertArgs, context, _info) => {
      const { ninja } = args;
      try {
        const insertedNinja = await context.pg.insertNinja(ninja);
        return pick(insertedNinja, ["id", "first_name", "last_name"]);
      } catch (err) {
        context.logger.error(err.message);
        throw new GraphQLError("Error while inserting ninja to database");
      }
    },
    updateNinja: async (_parent, args: NinjaUpdateArgs, context, _info) => {
      const { id, updates } = args;
      try {
        const updatedNinja = await context.pg.updateNinja(id, updates);
        return pick(updatedNinja, ["id", "first_name", "last_name"]);
      } catch (err) {
        context.logger.error(err.message);
        throw new GraphQLError("Error while updating ninja in database");
      }
    },
    deleteNinja: async (_parent, args: NinjaDeleteArgs, context, _info) => {
      const { id } = args;
      try {
        const deletedNinja = await context.pg.deleteNinja(id);
        return pick(deletedNinja, ["id", "first_name", "last_name"]);
      } catch (err) {
        context.logger.error(err.message);
        throw new GraphQLError("Error while deleteing ninja from database");
      }
    },
    addKnownJutsu: async (_parent, args, context, _info) => {
      const { ninja_id, jutsu_id } = args;
      try {
        const ninjaWithKnownJutsu = await context.pg.addKnownJutsu(ninja_id, jutsu_id);
        return ninjaWithKnownJutsu;
      } catch (err) {
        context.logger.error(err.message);
        throw new GraphQLError("Error while associating ninja and jutsu");
      }
    },
    removeKnownJutsu: async (_parent, args, context, _info) => {
      const { ninja_id, jutsu_id } = args;
      try {
        const ninjaWithKnownJutsu = await context.pg.removeKnownJutsu(ninja_id, jutsu_id);
        return ninjaWithKnownJutsu;
      } catch (err) {
        context.logger.error(err.message);
        throw new GraphQLError("Error while dis-associating ninja and jutsu");
      }
    },
  },
  Query: {
    ninja: async (_parent, args, context, _info) => {
      const { id } = args;
      try {
        const ninjaWithKnownJutsu = await context.pg.getNinjaWithRelatedJutsu(id);
        return ninjaWithKnownJutsu;
      } catch (err) {
        context.logger.error(err.message);
        throw new GraphQLError(`No ninja found for id: ${id}`);
      }
    },
  },
};
