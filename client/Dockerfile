# Stage 1: Build React app
FROM node:20-alpine AS builder

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Nginx static server
FROM nginx:alpine

# Copy built static files từ stage 1
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx config (SPA + proxy /api)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]