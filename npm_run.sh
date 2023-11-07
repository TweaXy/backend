#!/bin/bash
export PRISMA_MIGRATION_FORCE=true
npx prisma migrate dev
npm run start
