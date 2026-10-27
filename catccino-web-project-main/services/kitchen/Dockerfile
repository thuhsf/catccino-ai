FROM node:alpine

WORKDIR /kitchen

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4003

CMD ["npm", "start"]