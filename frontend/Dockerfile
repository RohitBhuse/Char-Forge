FROM node:20-slim

WORKDIR /app

# We use a volume mount for node_modules in docker-compose, this is just for container initial setup
COPY package.json ./
RUN npm install

# Command to run vite
CMD ["npm", "run", "dev"]
