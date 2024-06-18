FROM node:22-bullseye

RUN groupadd -g 449 dockeruser && \
    useradd -r -m -u 449 -g dockeruser dockeruser

USER dockeruser

COPY --chown=dockeruser:dockeruser ./package.json /home/dockeruser/project/package.json

WORKDIR /home/dockeruser/project

RUN npm install

COPY --chown=dockeruser:dockeruser ./config /home/dockeruser/project/config

COPY --chown=dockeruser:dockeruser ./src /home/dockeruser/project/src

RUN mkdir dist

RUN npm run build

ENTRYPOINT ["node", "dist/server.js"]

EXPOSE 4000
EXPOSE 5000