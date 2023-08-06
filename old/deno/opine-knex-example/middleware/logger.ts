import { OpineType } from "../deps.ts";

const addLogger = (app: OpineType): void => {
  app.use((req, _res, next) => {
    console.log(
      `${req.method} | ${req.path}`,
    );
    next();
  });
};

export default addLogger;
