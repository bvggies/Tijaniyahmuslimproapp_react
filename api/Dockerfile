FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Remove dev dependencies and cache
RUN npm prune --production && npm cache clean --force

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]
