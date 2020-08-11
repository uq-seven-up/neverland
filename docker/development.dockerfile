# syntax = docker/dockerfile:experimental
FROM node:10

# 2020-07-21 - Marcel Scherzer

# Update debian packages to the latest version.
RUN export DEBIAN_FRONTEND=noninteractive &&\
apt-get update &&\
apt-get -y upgrade &&\
apt-get -y autoremove &&\
apt-get clean &&\
rm -rf /var/lib/apt/lists/* &&\
mkdir -p /opt/workspace &&\
# Install node tooling required to build the projects.
npm install -g typescript 

WORKDIR /opt/workspace
EXPOSE 3000
