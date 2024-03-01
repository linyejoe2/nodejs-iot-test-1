FROM node:20.11.1 AS builder
WORKDIR /app
COPY  package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20.11.1
WORKDIR /app
COPY --from=builder /app/dist ./dest
COPY package*.json ./
RUN npm install --production
EXPOSE 3001
CMD [ "node", "./dist/index.js" ]