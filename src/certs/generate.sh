# https://stackoverflow.com/questions/7580508/getting-chrome-to-accept-self-signed-localhost-certificate#answer-44398368

# v3.ext
#authorityKeyIdentifier=keyid,issuer
#basicConstraints=CA:FALSE
#keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
#subjectAltName = @alt_names
#
#[alt_names]
#DNS.1 = localhost
#IP.1 = 192.168.0.2
#IP.2 = 127.0.0.1

openssl genrsa -out rootCA.key 4096
openssl req -x509 -new -nodes -key rootCA.key -newkey rsa:4096 -sha256 -days 1024 -out rootCA.pem
openssl req -new -newkey rsa:4096 -sha256 -nodes -keyout device.key -out device.csr
openssl x509 -req -in device.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out device.crt -days 2000 -sha256 -extfile v3.ext
openssl pkcs12 -export -out device.pfx -inkey device.key -in device.crt

# import rootCA.pem in Trusted Root Certificates Authorities store
# import .pfx file in Personal store
