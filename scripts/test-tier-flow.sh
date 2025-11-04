#!/bin/bash
# scripts/test-tier-flow.sh

echo "============================================"
echo "🧩 TESTE DE FLUXO DE PLANOS (BRONZE → INFINITY)"
echo "============================================"

# 1️⃣ Login e salvar token
TOKEN=$(curl -s -X POST http://localhost:3333/sessions \
  -H "Content-Type: application/json" \
  -d '{"email":"user@vendapragringa.com","password":"123456"}' | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Falha ao obter token. Verifique credenciais."
  exit 1
fi

echo "✅ Token obtido: $TOKEN"

# 2️⃣ Função para upgrade
upgrade_plan() {
  local plan=$1
  echo "➡️ Fazendo upgrade para: $plan"
  curl -s -X PUT http://localhost:3333/subscriptions/upgrade \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"plan\":\"$plan\"}" | jq
}

# 3️⃣ Função para simular raspagens
test_scraps() {
  local max=$1
  local plan=$2
  echo "🧪 Testando $max raspagens no plano $plan"
  for ((i=1;i<=$max;i++)); do
    result=$(curl -s -X GET http://localhost:3333/scrap \
      -H "Authorization: Bearer $TOKEN")
    echo "Raspagem #$i: $result"
  done
}

# 4️⃣ Fluxo de upgrades e testes
upgrade_plan "bronze"
test_scraps 15 "bronze"   # até o limite do bronze (~100 rasps/dia)

upgrade_plan "silver"
test_scraps 25 "silver"   # limite maior (300)

upgrade_plan "gold"
test_scraps 55 "gold"     # limite maior (600)

upgrade_plan "infinity"
test_scraps 60 "infinity" # deve permitir tudo, sem bloqueio

echo "🎉 Teste de fluxo de planos finalizado!"
