#!/bin/bash
if [ $# -ne 1 ]; then
  echo "> usage: $0 <HOSTNAME>"
  exit 1
fi

ssh -L 7051:localhost:7051 -L 9051:localhost:9051 -L 10051:localhost:10051 -L 7050:localhost:7050 -L 8080:localhost:8080 -L 8081:localhost:8081  -L 8082:localhost:8082 -L 5984:localhost:5984 $1
