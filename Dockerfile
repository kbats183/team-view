# Use Node.js LTS as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S svelte -u 1001
RUN chown -R svelte:nodejs /app
USER svelte

# Set default environment variables
ENV NODE_ENV=development
ENV PORT=5173
ENV HOST=0.0.0.0
ENV CONTEST_URL=https://localhost:8443/api/
ENV CONTEST_USER=admin
ENV CONTEST_PASSWORD=adm1n

# Expose the configurable port
EXPOSE $PORT

# Start the application in development mode
CMD ["sh", "-c", "npm run dev -- --port $PORT --host $HOST"]