# Next / Express / TS

A custom starting point for using Next (SSR), Express (API), and TS.

## Install

- `npm i`

## Startup (dev)

- `npm run dev`

## Startup (prod)

- `npm run build`
- `npm run build:server`
- `npm start`

## Custom Setup

### Typescript Setup

- `npx create-next-app <app-name>`
- create `tsconfig.json`
- `npm i --save-dev typescript @types/react @types/node`
- create `next-env.d.ts` file. (do not touch)

### Custom Server Setup (ts)

- see `server.ts`, `tsconfig.json`, `tsconfig.server.json`, and `package.json`
