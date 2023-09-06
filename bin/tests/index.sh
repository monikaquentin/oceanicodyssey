#!/bin/sh

npm run test:class && \
npm run test:spec:sign && \
npm run test:spec:verify
