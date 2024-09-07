# Use an official Ubuntu base image
FROM node:20.12.1-alpine
# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install npm dependencies
RUN npm cache clean --force && rm -rf node_modules && npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Define the command to run the application
CMD [ "npm", "run", "start" ]
