# Base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose port if needed (optional, for API)
EXPOSE 3000

# Run the agent
CMD ["node", "agent.js"]
