# MyPhonebook

This is a training project.

Persons has many contacts. Contacts has many phones.
You can manage your contacts.

### Features
- Add import/export your contacts via VCARD (.vcf) files
- Add HTTPS support

### Build

    npm install

    npm run build

### Run

HTTP only

    npm run start <port>

HTTPS

1. Import `build/certs/rootCA.pem` as Trusted Root Certificates Authorities
2. Import `build/certs/device.pfx` file in Personal certificate storage

3. `npm run start <port> https`

### Generate dummy persons
There is a file "generate_DB_with_data.sql" at the root of project.
Run it in runtime environment of Postgresql
