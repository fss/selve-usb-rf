FROM node:16-slim

# Create app directory
WORKDIR /usr/src/app

RUN apt-get update && apt-get -y install python3 build-essential

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm ci

# Bundle app source
COPY . .

EXPOSE 8080

CMD [ "node", "index.js" ]
