FROM node:9.5.0 AS build

COPY . /usr/src/
WORKDIR /usr/src/
RUN yarn install
RUN yarn unit
RUN yarn lint
RUN yarn run build --production


FROM nginx:1.13.8-alpine

EXPOSE 80
COPY --from=build /usr/src/dist /usr/share/nginx/html/
