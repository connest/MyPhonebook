openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -nodes -days 365 -subj "/C=RU/ST=Moscow/L=Moscow/O=Example-Certificates/CN=localhost"

REM  Generate self-signed CA
REM openssl req -x509 -newkey rsa-pss -pkeyopt rsa_keygen_bits:2048  -subj "/CN=localhost" -sha256 -nodes -keyout ca.key -out ca.cer

REM Generate server end entity certificate
REM openssl req -newkey rsa-pss -pkeyopt rsa_keygen_bits:2048 -subj "/CN=localhost" -sha256 -nodes -keyout server.key -out server.csr

REM openssl x509 -req -CAcreateserial -in server.csr -sha256 -CA ca.cer -CAkey ca.key -out server.cer