# backend docker file

FROM node:20
RUN npm install -g nodemon
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]