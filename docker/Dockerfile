# build stage
FROM  docker.io/node:18 AS build
ARG TARGET

WORKDIR /root
COPY . /root

RUN yarn install
RUN yarn build:${TARGET}
# RUN yarn deploy:k3s:commit

# final stage
FROM  docker.io/node:18

COPY --from=build /root/build /opt/graphql
COPY --from=build /root/.env /opt/graphql/.env

WORKDIR /opt/graphql

CMD node main.js
