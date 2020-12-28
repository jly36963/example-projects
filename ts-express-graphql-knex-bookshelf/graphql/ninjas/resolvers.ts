import { GraphQLError } from "graphql";
import { pick } from "lodash";
import { NinjaInsertArgs, NinjaUpdateArgs, NinjaDeleteArgs } from "../../types";

// obj -- previous object
// args -- arguments provided to the field in the GraphQL query
// context -- contextual info (current user, logger, db access)
// info -- field-specific info relevant to current query

export default {
  Mutation: {
    insertNinja: async (obj, args: NinjaInsertArgs, context, info) => {
      const { ninja } = args;
      try {
        const insertedNinja = await context.pg.insertNinja(ninja);
        return pick(insertedNinja, ["id", "first_name", "last_name"]);
      } catch (err) {
        context.logger.error(err.message);
        throw new GraphQLError("Error while inserting ninja to database");
      }
    },
    updateNinja: async (obj, args: NinjaUpdateArgs, context, info) => {
      const { id, updates } = args;
      try {
        const updatedNinja = await context.pg.updateNinja(id, updates);
        return pick(updatedNinja, ["id", "first_name", "last_name"]);
      } catch (err) {
        context.logger.error(err.message);
        throw new GraphQLError("Error while updating ninja in database");
      }
    },
    deleteNinja: async (obj, args: NinjaDeleteArgs, context, info) => {
      const { id } = args;
      try {
        const deletedNinja = await context.pg.deleteNinja(id);
        return pick(deletedNinja, ["id", "first_name", "last_name"]);
      } catch (err) {
        context.logger.error(err.message);
        throw new GraphQLError("Error while deleteing ninja from database");
      }
    },
    addKnownJutsu: async (obj, args, context, info) => {
      const { ninja_id, jutsu_id } = args;
      try {
        const ninjaWithKnownJutsu = await context.pg.addKnownJutsu(ninja_id, jutsu_id);
        return ninjaWithKnownJutsu;
      } catch (err) {
        context.logger.error(err.message);
        throw new GraphQLError("Error while associating ninja and jutsu");
      }
    },
    removeKnownJutsu: async (obj, args, context, info) => {
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
    ninja: async (obj, args, context, info) => {
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
