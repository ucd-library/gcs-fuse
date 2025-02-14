FROM node:22

RUN apt-get update && apt-get install -y curl ca-certificates gnupg

RUN curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg && \
  echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && \
  apt-get update && apt-get install -y google-cloud-sdk



RUN mkdir /service
WORKDIR /service

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY lib lib
COPY index.js .

CMD ["node", "index.js"]