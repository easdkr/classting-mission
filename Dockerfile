FROM node:20-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

FROM node:20-alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn add production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 80

RUN cat $DATABASE_HOST

CMD /bin/sh -c "yarn migration:run:prod && NODE_ENV=production node dist/src/main"