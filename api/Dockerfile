FROM node:9.7.0-alpine

EXPOSE 3003
ENV NODE_ENV production
WORKDIR /usr/src/
COPY package.json /usr/src/
RUN yarn install
COPY . /usr/src/
CMD ["node", "server"]
