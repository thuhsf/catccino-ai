#!/usr/bin/env bash

set -e

echo "⚠️  Isso irá remover:"
echo "  - Containers do projeto"
echo "  - Networks do projeto"
echo "  - Volumes do projeto (incluindo banco de dados)"
echo "  - Containers parados"
echo "  - Volumes órfãos do Docker"
echo "  - Cache de build"
echo ""
echo "  Obs: Se estiver executando após ter finalizado a ultima execução"
echo "       cancele esse script com Ctrl-C e depois execute os comandos:"
echo "       'docker compose down' -v e depois 'docker compose up --build'"
echo ""

read -p "Tem certeza que deseja continuar? (y/N): " confirm

if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo "❌ Operação cancelada."
    exit 0
fi

echo ""
echo "🛑 Derrubando containers antigos..."
docker compose down --remove-orphans --volumes

echo "🧹 Limpando containers parados..."
docker container prune -f

echo "🧹 Limpando volumes não utilizados..."
docker volume prune -f

echo "🔨 Rebuildando sem cache..."
docker compose build --no-cache

echo ""
read -p "Deseja iniciar em background (-d)? (y/N): " detached

echo "🚀 Iniciando containers..."

if [[ "$detached" == "y" || "$detached" == "Y" ]]; then
    docker compose up -d
    echo "✅ Containers iniciados em background."
else
    docker compose up
fi