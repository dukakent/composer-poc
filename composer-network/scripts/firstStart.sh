#!/bin/bash

find . -name '*.bna' -delete
find . -name 'networkadmin.card' -delete
npm version 0.0.1 --allow-same-version
composer card delete -c admin@evnet

composer archive create -t dir -n ./
composer network install -a evnet@0.0.1.bna -c PeerAdmin@hlfv1
composer network start --networkName evnet --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card
composer card import --file ./networkadmin.card

echo 'Upgrade completed. Here are logs:'

docker logs -f dev-peer0.org1.example.com-evnet-0.0.1 | grep @debug
