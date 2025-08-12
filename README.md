# OCIF Library

OCIF is an interchange file format for canvas-based applications. Visual nodes, structural relations, assets, and schemas. This project provides a library and tools to work with OCIF files.

## Install dependencies

```bash
npm install
```

## Build the library

```bash
npm run build
```

## Utility apps

### Validator

```bash
npm run serve:validator
```

### JSONCanvasToOCIF

```bash
npm run serve:jsoncanvas-ocif
```

### NodeJS API

Test application that ensures that the library is compatible with NodeJS.

1. Build the library first!

   ```bash
   npm run build
   ```

2. Run the app

   ```bash
   npm run serve:nodejs-api
   ```

## Test apps (playwright)

1. Set up playwright

```bash
npm run playwright:install
```

2. Run the tests

```bash
npm run test:playwright
```
