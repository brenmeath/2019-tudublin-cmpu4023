#!/bin/sh
if [ -z $1 ]; then
    echo "Usage: $0 <dbuser>"
    exit 1
fi

DB_USER=$1
CUR_DIR=$(pwd)
cd /
sudo -u postgres psql -d eadwks2 < $CUR_DIR/dbsetup.sql
sudo -u postgres psql -c \
    "
    --grant privileges where needed
    --GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE users TO $DB_USER;
    GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE products TO $DB_USER;
    "
