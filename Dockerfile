# Use a specific version of node
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your app's source code
COPY . .

# Build your app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start your app
CMD ["npm", "run", "start"]

# to run the image:
# docker run -p [desiered port]:3000 [name of the image]