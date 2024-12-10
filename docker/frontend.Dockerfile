FROM node:18-alpine

WORKDIR /app

COPY frontend/package*.json ./

RUN npm install && \
    npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @react-google-maps/api --save

COPY frontend/ .

EXPOSE 3000

CMD ["npm", "start"]