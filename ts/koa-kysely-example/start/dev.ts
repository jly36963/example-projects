import {startServer} from '../index.js';
import {ServerConfigSchema} from '../types/index.js';
import {readDotenv} from './utils.js';

async function main() {
  const env = readDotenv();
  const config = ServerConfigSchema.parse(env);
  await startServer(config);
}

main();
