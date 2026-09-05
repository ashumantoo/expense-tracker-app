# specify the node base image with your desired version node:<version>
FROM node:24

#WORKING DIRECTORY OF CONTAINER
WORKDIR /app

#COPY package.json file to current working directory in container which is /app
COPY package.json .

#Install all npm packages
RUN npm install

#COPY all the files and folder from current working directory to the container current working directory
COPY . ./

#Build the app to access the server.js file from dist folder
RUN npm run build

# Expose the application port
EXPOSE 8000

#COMMAND to run the app in development mode
CMD ["node","dist/server.js"]