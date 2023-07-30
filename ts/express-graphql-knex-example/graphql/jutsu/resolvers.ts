import {GraphQLError} from 'graphql';
import type {
  GqlContext,
  Jutsu,
  JutsuInput,
  JutsuUpdates,
} from '../../types/index.js';

export default {
  Mutation: {
    insertJutsu: async (
      parent: unknown,
      args: {jutsu: JutsuInput},
      ctx: GqlContext,
      info: unknown
    ): Promise<Jutsu> => {
      const {jutsu} = args;
      const {pgDal, logger} = ctx.providers;
      try {
        const insertedJutsu = await pgDal.jutsus.insert(jutsu);
        if (!insertedJutsu) {
          throw new Error();
        }
        return insertedJutsu;
      } catch (err) {
        logger.error(err);
        throw new GraphQLError('Error while inserting jutsu to database');
      }
    },
    updateJutsu: async (
      parent: unknown,
      args: {id: string; updates: JutsuUpdates},
      ctx: GqlContext,
      info: unknown
    ): Promise<Jutsu> => {
      const {id, updates} = args;
      const {pgDal, logger} = ctx.providers;
      try {
        const updatedJutsu = await pgDal.jutsus.update(id, updates);
        if (!updatedJutsu) {
          throw new Error();
        }
        return updatedJutsu;
      } catch (err) {
        logger.error(err);
        throw new GraphQLError('Error while updating jutsu in database');
      }
    },
    deleteJutsu: async (
      parent: unknown,
      args: {id: string},
      ctx: GqlContext,
      info: unknown
    ): Promise<Jutsu> => {
      const {id} = args;
      const {pgDal, logger} = ctx.providers;
      try {
        const deletedJutsu = await pgDal.jutsus.del(id);
        if (!deletedJutsu) {
          throw new Error();
        }
        return deletedJutsu;
      } catch (err) {
        logger.error(err);
        throw new GraphQLError('Error while deleteing jutsu from database');
      }
    },
  },
  Query: {
    jutsu: async (
      parent: unknown,
      args: {id: string},
      ctx: GqlContext,
      info: unknown
    ): Promise<Jutsu> => {
      const {id} = args;
      const {pgDal, logger} = ctx.providers;
      try {
        const jutsu = await pgDal.jutsus.get(id);
        if (!jutsu) {
          throw new Error();
        }
        return jutsu;
      } catch (err) {
        logger.error(err);
        throw new GraphQLError(`No jutsu found for id: ${id}`);
      }
    },
  },
};
