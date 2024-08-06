FROM node:lts-slim AS base

# Create app directory
WORKDIR /app

# Files required by npm install
COPY package*.json .

# Install app dependencies
RUN npm ci

# Bundle app source
COPY . .

# Type check app
# RUN npm run typecheck

# Create a volume for the SQLite database
VOLUME ["/app/sqlite"]

USER node

# Start the app
EXPOSE 80
CMD ["npm", "run", "start"]