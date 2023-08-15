FROM node:hydrogen-slim

# install build dependencies
RUN apt-get update && apt-get -y install python3 build-essential

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# install all dependencies
RUN npm ci

# Bundle app source
COPY . .

EXPOSE 8080

CMD [ "node", "index.js" ]
