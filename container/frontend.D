# Stage 1: Build
FROM node:latest as build

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn build

# Stage 2: Serve

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]