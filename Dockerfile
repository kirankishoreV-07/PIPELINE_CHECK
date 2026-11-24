FROM node:20-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY src ./src
COPY public ./public
COPY data ./data
USER node
EXPOSE 3000
CMD ["node", "src/server.js"]
