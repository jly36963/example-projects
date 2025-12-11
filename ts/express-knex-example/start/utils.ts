import dotenv from 'dotenv';
import {chain, camelCase} from 'lodash-es';

/** Read .env file, pick keys, map keys to camelCase */
export function readDotenv() {
  return chain(dotenv.config())
    .get('parsed')
    .pick(['NODE_ENV', 'PORT', 'PG_URL'])
    .mapKeys((v, k) => camelCase(k))
    .value();
}
