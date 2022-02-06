import chalk from "chalk";

const toJSON = (x) => JSON.stringify(x, null, 2);

const log = (x) => {
  console.log(toJSON(x));
  // TODO: send payload to service or data store
};

const info = (x) => {
  console.log(chalk.blue(toJSON(x)));
  // TODO: send payload to service or data store
};

const success = (x) => {
  console.log(chalk.green(toJSON(x)));
  // TODO: send payload to service or data store
};

const warning = (x) => {
  console.log(chalk.yellow(toJSON(x)));
  // TODO: send payload to service or data store
};

const error = (x) => {
  console.log(chalk.red(toJSON(x)));
  // TODO: send payload to service or data store
};

const logger = {
  log,
  info,
  success,
  warning,
  error,
};

export default logger;
