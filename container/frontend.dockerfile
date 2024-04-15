# Stage 1: Build
FROM node:latest as build

WORKDIR /app

ENV REACT_APP_FIA_REST_API_URL="/api"

COPY . .



RUN yarn install
RUN yarn build

# Stage 2: Serve

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html


ENV REACT_APP_FIA_REST_API_URL="/api"

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]