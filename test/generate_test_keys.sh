#!/bin/bash
KEYS=(128 256 512 1024 2048);

for KEY in "${KEYS[@]}"
do
	openssl genrsa -out "rsa_"$KEY"_priv.pem" $KEY
	openssl rsa -pubout -in "rsa_"$KEY"_priv.pem" -out "rsa_"$KEY"_pub.pem"
done
