#!/bin/sh
set -e

SQL_DIR="/docker-entrypoint-initdb.d/sql"

for name in schema inserts views functions procedures; do
  file="$SQL_DIR/$name.sql"
  if [ -f "$file" ]; then
    echo "Carregando $file"
    mysql --default-character-set=utf8mb4 -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" < "$file"
  fi
done
