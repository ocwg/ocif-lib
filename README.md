# OCIF Library

## run apps

npx nx serve apps/react-app
npx nx serve apps/nodejs-api

## Installation and project setup for ocif-lib

with the following steps the repo was setup:

npx create-nx-workspace@latest ocif-lib --package-manager=npm --preset=apps
cd ocif-lib

npx nx add @nx/node
npx nx add @nx/react

npx nx generate @nx/node:application apps/nodejs-api
npx nx generate @nx/react:application apps/react-app
npx nx generate @nx/react:application apps/jsoncanvas-ocif

npx nx generate @nx/js:lib libs/ocif-lib --publishable --importPath="@ocif/lib"
(use vite and vitest)

settings in vite.config under build:

```ts

fileName: (format) => {
    if (format === 'es') return 'index.mjs';
    if (format === 'cjs') return 'index.cjs';
    return 'index.js';
},
formats: ['es' as const, 'cjs' as const],

```

npx nx build libs/ocif-lib
