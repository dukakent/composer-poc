#!/bin/bash

npm version patch

archiveName=$(composer archive create -t dir -n ./ | awk '/Identifier:/ { print $2}')
archiveVersion=$(echo $archiveName | cut -d '@' -f 2)

echo Archive Name: $(echo $archiveName)
echo Archive Version: $(echo $archiveVersion)

composer network install -a $(echo $archiveName).bna -c PeerAdmin@hlfv1
composer network upgrade -c PeerAdmin@hlfv1 -n evnet -V $(echo $archiveVersion)

echo 'Upgrade completed. Here are logs:'

docker logs -f dev-peer0.org1.example.com-evnet-$(echo $archiveVersion) | grep @debug
