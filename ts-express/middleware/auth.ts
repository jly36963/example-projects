import express = require("express");
// middleware
// get authState from request body
// if falsey, return error response
// if truthy, continue to handler (or next middleware)
const auth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { authState } = req.body;
  if (!authState) return res.status(401).json({ message: "Improper auth" });
  next();
};
export = auth;
