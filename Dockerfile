FROM node:16-alpine
WORKDIR /usr/app/provo
COPY . .
RUN npm install
RUN npm run build
RUN npm prune --production
EXPOSE 3000
CMD ["npm", "run", "start:prod"]