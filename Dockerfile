####################################
# Dockerfile to test and have fun  #
# Use ubuntu                       #
####################################

FROM ubuntu:16.04
MAINTAINER Alec Chamberland

RUN mkdir /node
RUN mkdir /node/alshockeypool
ADD . /node/alshockeypool
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs
WORKDIR /node/alshockeypool
RUN npm install
RUN npm install -g webpack
RUN webpack -p
EXPOSE 8080
CMD ["/usr/sbin/sshd", "-D"]
ENTRYPOINT /usr/bin/node .