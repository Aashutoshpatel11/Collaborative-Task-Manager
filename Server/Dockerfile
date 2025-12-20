# Server/Dockerfile

# Stage 1: Build the application (if TypeScript)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Install all dependencies (including devDependencies for tsc)
RUN npm install
COPY . .
# Run build script if it exists, otherwise ignore
RUN npm run build --if-present

# Stage 2: Production Run
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app ./

# Expose the port the app runs on
EXPOSE 5000

# Start command - change 'start' to 'dev' if you haven't set up a build script yet
CMD ["npm", "run", "dev"]