FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json ./
COPY tsconfig.base.json ./
COPY turbo.json ./
COPY apps ./apps
COPY libs ./libs
RUN npm install
RUN npm run build -- --filter=@app/user-service

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/user-service/dist ./apps/user-service/dist
COPY --from=builder /app/libs ./libs

EXPOSE 3000
CMD ["node", "apps/user-service/dist/main.js"]
