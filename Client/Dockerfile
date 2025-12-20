# Client/Dockerfile

# Stage 1: Build React App
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Set API URL to relative path so Nginx handles the proxy
ENV VITE_SERVER_URL=http://localhost:4000/api/v1
ENV VITE_SOCKET_SERVER_URL=http://localhost:4000
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Copy build output to Nginx html folder
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]