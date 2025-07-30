FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache \
    openssl \
    postgresql-client

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY prisma ./prisma/

RUN npx prisma generate

COPY . .

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:4000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

CMD ["npm", "start"]