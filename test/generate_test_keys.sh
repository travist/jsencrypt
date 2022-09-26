#!/bin/bash
KEYS=(128 256 512 1024 2048);

for KEY in "${KEYS[@]}"
do
	openssl genrsa -out "rsa_"$KEY"_priv.pem" $KEY
	openssl rsa -pubout -in "rsa_"$KEY"_priv.pem" -out "rsa_"$KEY"_pub.pem"
done

ssh-keygen -t rsa -b 1024 -C jsencrypt@test.com -f $HOME/.ssh/jsencrypt -q -N '' -y
ssh-keygen -f $HOME/.ssh/jsencrypt.pub -e -m pem > pkcs1.pub

