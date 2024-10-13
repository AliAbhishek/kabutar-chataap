
FROM node:20.11.0

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

Expose 8000

CMD ["nodemon","index.js"]