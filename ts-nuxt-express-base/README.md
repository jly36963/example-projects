# Vue / Nuxt / Express / TS

A starting point for Vue/Nuxt with a custom api server (Express).

## Setup

- `npm i`

## Startup (dev)

- `npm run dev`

## Startup (prod)

- `npm run build`
- `npm start`

## Nuxt

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## TS

### Docs

https://typescript.nuxtjs.org/

### Nuxt Config

```js
{
  buildModules: ['@nuxt/typescript-build'];
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "ESNext",
    "moduleResolution": "Node",
    "lib": ["ESNext", "ESNext.AsyncIterable", "DOM"],
    "esModuleInterop": true,
    "allowJs": true,
    "sourceMap": true,
    "strict": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "~/*": ["./*"],
      "@/*": ["./*"]
    },
    "types": ["@types/node", "@nuxt/types"]
  },
  "exclude": ["node_modules"]
}
```

### Types

in the `/` or `/types` directory, add a file `vue-shim.d.ts` with these contents:

```ts
declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
```

### Components

Use `ts` or `tsx`

```vue
<script lang="ts">
// use TypeScript here
</script>
```

### Scripts

```json
{
  "scripts": {
    "dev": "nuxt-ts",
    "build": "nuxt-ts build",
    "generate": "nuxt-ts generate",
    "start": "nuxt-ts start"
  }
}
```

## Express

Express api is registered in `nuxt.config.js`

```json
{
  "serverMiddleware": [
    // register a handler (api service) to a route
    { "path": "/api", "handler": "~/api/index.js" }
  ]
}
```
