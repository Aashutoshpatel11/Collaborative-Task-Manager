
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./

RUN npm install
COPY . .

RUN npm run build --if-present


FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app ./


EXPOSE 5000


CMD ["npm", "run", "dev"]