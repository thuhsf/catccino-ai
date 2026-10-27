FROM node:alpine

WORKDIR /notification

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4004

CMD ["npm", "start"]