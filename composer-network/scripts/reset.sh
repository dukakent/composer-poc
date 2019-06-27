#!/bin/bash

find . -name '*.bna' -delete
find . -name 'networkadmin.card' -delete
npm version 0.0.1 --allow-same-version
composer card delete -c admin@evnet