# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies and nodemon
RUN npm install && npm install -g nodemon

# Copy source code
COPY . .

# Expose port 
EXPOSE 3000

# Start app
CMD ["npm", "run", "dev"]
