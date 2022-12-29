import { GraphQLError } from "graphql";
import { pick } from "lodash";
import { JutsuInsertArgs, JutsuUpdateArgs, JutsuDeleteArgs } from "../../types";

export default {
  Mutation: {
    insertJutsu: async (_parent, args: JutsuInsertArgs, context, _info) => {
      const { jutsu } = args;
      try {
        const insertedJutsu = await context.pg.insertJutsu(jutsu);
        return pick(insertedJutsu, ["id", "name", "chakra_nature", "description"]);
      } catch (err) {
        context.logger.error(err.message);
        throw new GraphQLError("Error while inserting jutsu to database");
      }
    },
    updateJutsu: async (_parent, args: JutsuUpdateArgs, context, _info) => {
      const { id, updates } = args;
      try {
        const updatedJutsu = await context.pg.updateJutsu(id, updates);
        return pick(updatedJutsu, ["id", "name", "chakra_nature", "description"]);
      } catch (err) {
        context.logger.error(err.message);
        throw new GraphQLError("Error while updating jutsu in database");
      }
    },
    deleteJutsu: async (_parent, args: JutsuDeleteArgs, context, _info) => {
      const { id } = args;
      try {
        const deletedJutsu = await context.pg.deleteJutsu(id);
        return pick(deletedJutsu, ["id", "name", "chakra_nature", "description"]);
      } catch (err) {
        context.logger.error(err.message);
        throw new GraphQLError("Error while deleteing jutsu from database");
      }
    },
  },
  Query: {
    jutsu: async (_parent, args, context, _info) => {
      const { id } = args;
      try {
        const jutsuRecord = await context.pg.getJutsu(id);
        if (!jutsuRecord) throw new Error();
        const jutsu = pick(jutsuRecord, ["id", "name", "chakra_nature", "description"]);
        return jutsu;
      } catch (err) {
        context.logger.error(err.message);
        throw new GraphQLError(`No jutsu found for id: ${id}`);
      }
    },
  },
};
