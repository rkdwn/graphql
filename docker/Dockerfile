# build stage
FROM  docker.io/node:18 AS build

WORKDIR /root
COPY . /root

RUN yarn install
RUN yarn build

# final stage
FROM  docker.io/node:18

WORKDIR /opt/graphql
COPY --from=build /root/build /opt/graphql

CMD ["node", "main.js"]
