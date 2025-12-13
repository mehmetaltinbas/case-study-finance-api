# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

RUN npm run db:prisma:dev:generate --binary-targets native linux-arm64-openssl-3.0.x

# Build the NestJS application
RUN npm run build

# Expose the application port
EXPOSE 5010

# Command to run the application
CMD ["node", "dist/src/main.js"]