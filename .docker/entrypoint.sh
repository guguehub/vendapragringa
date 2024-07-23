#!/bin/bash

npm install
PG_HOST=db REDIS_HOST=redis APP_API_URL=localhost:3333 npm run typeorm migration:run
npm run dev
