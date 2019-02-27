FROM node:lts-alpine

ENV PROJECT_ROOT /usr/src/app

WORKDIR ${PROJECT_ROOT}

RUN adduser --disabled-password --gecos '' noroot
RUN chown -R noroot:noroot $PROJECT_ROOT
USER noroot

COPY package*.json ./
RUN npm install

COPY . ${PROJECT_ROOT}

EXPOSE 4000
ENTRYPOINT ["/usr/local/bin/npm"]
CMD ["start"]