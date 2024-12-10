FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
RUN npm install framer-motion@10.16.5

COPY . .

EXPOSE 3000

CMD ["npm", "start"]