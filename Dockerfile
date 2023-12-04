FROM ubuntu:latest
SHELL ["/bin/bash", "-c"]
RUN apt update
RUN apt install -y npm
RUN apt install -y curl
RUN mkdir -p /usr/local/nvm
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION v21.1.0
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
RUN  source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm use --delete-prefix $NODE_VERSION
RUN node --version
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/$NODE_VERSION/bin:$PATH
RUN source $NVM_DIR/bash_completion
RUN node --version
RUN npm install -g prisma
EXPOSE 3000
WORKDIR /app/backend
COPY . .
RUN chmod +x npm_run.sh
RUN chmod +x test_db.sh
RUN chmod +x prod_db.sh
RUN npm install
COPY --from=ghcr.io/ufoscout/docker-compose-wait:latest /wait /wait
RUN ./test_db.sh
RUN npm run prisma-migrate-seed
RUN npm test
RUN ./prod_db.sh
RUN npm run prisma-migrate-seed
CMD /wait && ./npm_run.sh














