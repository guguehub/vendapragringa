#!/bin/bash
set -e

DB_HOST=${TYPEORM_HOST:-db}
DB_PORT=${TYPEORM_PORT:-5432}
DB_USER=${TYPEORM_USERNAME:-postgres}
DB_NAME=${TYPEORM_DATABASE:-app}

echo "⏳ Aguardando o banco de dados iniciar em $DB_HOST:$DB_PORT..."

until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; do
  echo "❌ Banco ainda não está pronto - aguardando..."
  sleep 2
done

echo "✅ Banco de dados está pronto!"

# Rodar migrations
echo "📦 Rodando migrations..."
yarn typeorm:migration:run

# Iniciar a aplicação
echo "🚀 Iniciando servidor..."
yarn dev
