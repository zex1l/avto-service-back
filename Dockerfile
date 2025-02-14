FROM node:20.17.0-alpine as base

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./

RUN npm install --frozen-lockfile

COPY . .

FROM base as build

COPY . .

RUN npx prisma generate

RUN npm run build

FROM base as production

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/package*.json ./

RUN npm install --production

COPY --from=build /app/dist ./dist

COPY --from=build /app/prisma/generated ./prisma/generated

CMD ["node", "dist/main"]
