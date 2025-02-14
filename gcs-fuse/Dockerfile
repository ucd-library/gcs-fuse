FROM debian:bullseye
RUN apt-get update && apt-get install -y curl ca-certificates gnupg


# RUN export LSB_RELEASE=$(lsb_release -c -s)
ENV GCSFUSE_REPO=gcsfuse-bullseye
RUN echo "deb https://packages.cloud.google.com/apt $GCSFUSE_REPO main" | tee /etc/apt/sources.list.d/gcsfuse.list

RUN curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | \
  tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | \
  apt-key --keyring /usr/share/keyrings/cloud.google.gpg add - && apt-get update -y && apt-get install -y fuse gcsfuse google-cloud-cli

COPY run.sh /run.sh

CMD ["/run.sh"]