# OCIF Library

OCIF is an interchange file format for canvas-based applications. Visual nodes, structural relations, assets, and schemas. This project provides a library and tools to work with OCIF files.

## run apps

npx nx serve apps/ocif-tools-app
npx nx serve apps/jsoncanvas-ocif
npx nx serve apps/nodejs-api

## test apps (playwright)

npx nx e2e apps/ocif-tools-app-e2e

with UI : npx nx e2e apps/ocif-tools-app-e2e --ui

## Installation and project setup for ocif-lib

with the following steps the repo was setup:

npx create-nx-workspace@latest ocif-lib --package-manager=npm --preset=apps
cd ocif-lib

npx nx add @nx/node
npx nx add @nx/react

npx nx generate @nx/node:application apps/nodejs-api
npx nx generate @nx/react:application apps/ocif-tools-app
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
