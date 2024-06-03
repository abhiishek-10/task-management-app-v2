FROM node:18

# Create app directory
WORKDIR ./

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
EXPOSE 7860
COPY . .
CMD [ "node", "./server.js" ]