FROM node:alpine

WORKDIR /customer

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4006

CMD ["npm", "start"]
