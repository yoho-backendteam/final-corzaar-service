FROM node:18-alpine

WORKDIR /


COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3003
CMD [ "node","index.js" ]