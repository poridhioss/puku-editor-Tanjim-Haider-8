FROM node:22-bookworm-slim

RUN apt-get update && \
    apt-get install -y \
    git \
    docker.io \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production

EXPOSE 7000

CMD ["npm", "start"]