#!/usr/bin/env bash

echo "⚠️  Isso irá remover:"
echo "  - Containers"
echo "  - Images"
echo "  - Volumes"
echo "  - Networks"
echo "  - Cache de build"
echo ""
echo "  Obs: Se estiver executando após ter finalizado a ultima execução"
echo "       cancele esse script com Ctrl-C e depois execute os comandos:"
echo "       'docker compose down' -v e depois 'docker compose up --build'"
echo ""

read -p "Tem certeza? (y/N): " confirm

if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Cancelado."
  exit 0
fi

echo "🛑 Parando containers..."
docker compose down --remove-orphans 2>/dev/null

echo "🧹 Removendo TODOS os containers..."
docker rm -f $(docker ps -aq) 2>/dev/null

echo "🗑️ Removendo TODAS as images..."
docker rmi -f $(docker images -aq) 2>/dev/null

echo "💾 Removendo TODOS os volumes..."
docker volume rm $(docker volume ls -q) 2>/dev/null

echo "🌐 Removendo networks não utilizadas..."
docker network prune -f

echo "🧱 Limpando build cache..."
docker builder prune -af

echo "🧼 Limpando sistema completo..."
docker system prune -af --volumes

echo "✅ Docker completamente limpo."