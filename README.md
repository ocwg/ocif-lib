# OCIF Library

OCIF is an interchange file format for canvas-based applications. Visual nodes, structural relations, assets, and schemas. This project provides a library and tools to work with OCIF files.

## run apps

npx nx serve apps/ocif-tools-app

npx nx serve apps/jsoncanvas-ocif

npx nx serve apps/nodejs-api

## test apps (playwright)

npx nx e2e apps/ocif-tools-app-e2e

with UI : npx nx e2e apps/ocif-tools-app-e2e --ui

## build library

npx nx build libs/ocif-lib
