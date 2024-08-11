#!/bin/bash

npm install
#!/npm run typeorm:migration:container
npm run typeorm -- -d src/shared/infra/typeorm/index.ts migration:run
npm run dev
