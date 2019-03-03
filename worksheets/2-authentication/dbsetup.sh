#!/bin/sh

# script to create and populate our database and assign needed permissions

if [ -z $1 ]; then
    echo "Usage: $0 <dbuser>"
    exit 1
fi

DB_USER=$1
DB_NAME=eadwks2
CUR_DIR=$(pwd)
cd /
sudo -u postgres psql -d $DB_NAME < $CUR_DIR/dbsetup.sql

# we assume that the $DB_USER already exists
echo "Granting table privileges for user \"$DB_USER\""
sudo -u postgres psql -d $DB_NAME -c "GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE products TO $DB_USER;"
