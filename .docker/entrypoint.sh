#!/bin/bash
set -e

DB_HOST=${TYPEORM_HOST:-db}
DB_PORT=${TYPEORM_PORT:-5432}

echo "⏳ Aguardando o banco de dados iniciar em $DB_HOST:$DB_PORT..."

until nc -z $DB_HOST $DB_PORT; do
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
