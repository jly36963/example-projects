import {GraphQLError} from 'graphql';
import type {
  GqlContext,
  Ninja,
  NinjaWithJutsus,
  NinjaInput,
  NinjaUpdates,
} from '../../types/index.js';

// obj -- previous object
// args -- arguments provided to the field in the GraphQL query
// ctx -- contextual info (current user, logger, db access)
// info -- field-specific info relevant to current query

export default {
  Mutation: {
    insertNinja: async (
      parent: unknown,
      args: {ninja: NinjaInput},
      ctx: GqlContext,
      info: unknown
    ): Promise<Ninja> => {
      const {ninja} = args;
      const {pgDal, logger} = ctx.providers;
      try {
        const insertedNinja = await pgDal.ninjas.insert(ninja);
        if (!insertedNinja) {
          throw new Error();
        }
        return insertedNinja;
      } catch (err) {
        logger.error(err);
        throw new GraphQLError('Error while inserting ninja to database');
      }
    },
    updateNinja: async (
      parent: unknown,
      args: {id: string; updates: NinjaUpdates},
      ctx: GqlContext,
      info: unknown
    ): Promise<Ninja> => {
      const {id, updates} = args;
      const {pgDal, logger} = ctx.providers;
      try {
        const updatedNinja = await pgDal.ninjas.update(id, updates);
        if (!updatedNinja) {
          throw new Error();
        }
        return updatedNinja;
      } catch (err) {
        logger.error(err);
        throw new GraphQLError('Error while updating ninja in database');
      }
    },
    deleteNinja: async (
      parent: unknown,
      args: {id: string},
      ctx: GqlContext,
      info: unknown
    ): Promise<Ninja> => {
      const {id} = args;
      const {pgDal, logger} = ctx.providers;
      try {
        const deletedNinja = await pgDal.ninjas.del(id);
        if (!deletedNinja) {
          throw new Error();
        }
        return deletedNinja;
      } catch (err) {
        logger.error(err);
        throw new GraphQLError('Error while deleteing ninja from database');
      }
    },
    addKnownJutsu: async (
      parent: unknown,
      args: {ninjaId: string; jutsuId: string},
      ctx: GqlContext,
      info: unknown
    ): Promise<NinjaWithJutsus> => {
      const {ninjaId, jutsuId} = args;
      const {pgDal, logger} = ctx.providers;
      try {
        await pgDal.ninjas.associateJutsu(ninjaId, jutsuId);
        const ninjaWithJutsus = await pgDal.ninjas.getNinjaWithJutsus(ninjaId);
        if (!ninjaWithJutsus) {
          throw new Error();
        }
        return ninjaWithJutsus;
      } catch (err) {
        logger.error(err);
        throw new GraphQLError('Error while associating ninja and jutsu');
      }
    },
    removeKnownJutsu: async (
      parent: unknown,
      args: {ninjaId: string; jutsuId: string},
      ctx: GqlContext,
      info: unknown
    ): Promise<NinjaWithJutsus> => {
      const {ninjaId, jutsuId} = args;
      const {pgDal, logger} = ctx.providers;
      try {
        await pgDal.ninjas.disassociateJutsu(ninjaId, jutsuId);
        const ninjaWithJutsus = await pgDal.ninjas.getNinjaWithJutsus(ninjaId);
        if (!ninjaWithJutsus) {
          throw new Error();
        }
        return ninjaWithJutsus;
      } catch (err) {
        logger.error(err);
        throw new GraphQLError('Error while dissociating ninja and jutsu');
      }
    },
  },
  Query: {
    ninja: async (
      parent: unknown,
      args: {id: string},
      ctx: GqlContext,
      info: unknown
    ): Promise<NinjaWithJutsus> => {
      const {id} = args;
      const {pgDal, logger} = ctx.providers;
      // TODO: only fetch related if requested (maybe use child node)
      try {
        const ninjaWithJutsus = await pgDal.ninjas.getNinjaWithJutsus(id);
        if (!ninjaWithJutsus) {
          throw new Error();
        }
        return ninjaWithJutsus;
      } catch (err) {
        logger.error(err);
        throw new GraphQLError(`No ninja found for id: ${id}`);
      }
    },
  },
};
