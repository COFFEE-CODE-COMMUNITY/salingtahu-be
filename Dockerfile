FROM node:lts-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:lts-alpine as production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

RUN chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 8080

CMD ["node", "dist/main.js"]