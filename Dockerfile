FROM node:13-alpine

WORKDIR /usr/src/app

## copy files
COPY . .

RUN ls -la

EXPOSE 5000

RUN npm install
RUN npm uninstall -g serve 
RUN npm i -S serve
RUN npm run-script build
ENTRYPOINT [ "./node_modules/.bin/serve", "-s", "build" ]