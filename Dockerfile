# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the code
COPY . .

# Expose port
EXPOSE 4000

# Command to run the app
CMD ["node", "src/index.js"]
