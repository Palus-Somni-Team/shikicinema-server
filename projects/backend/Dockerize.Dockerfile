ARG baseImage

FROM $baseImage

RUN apt-get update && apt-get -y install curl

ENV DOCKERIZE_VERSION v0.6.1

RUN curl -L https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz | tar -xzC /usr/local/bin
