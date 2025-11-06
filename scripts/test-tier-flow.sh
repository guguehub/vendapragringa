#!/bin/bash
# scripts/test-tier-flow.sh
# Fluxo completo de teste de planos e cotas de raspagem

echo "============================================"
echo "🧩 TESTE DE FLUXO DE PLANOS (BRONZE → INFINITY)"
echo "============================================"

API_URL="http://localhost:3333"
EMAIL="user@vendapragringa.com"
PASSWORD="123456"

# 1️⃣ Login e salvar token
TOKEN=$(curl -s -X POST "$API_URL/sessions" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Falha ao obter token. Verifique credenciais ou servidor."
  exit 1
fi

echo "✅ Token obtido com sucesso!"
echo "--------------------------------------------"

# Contadores globais
declare -A PLAN_SUCCESS
declare -A PLAN_BLOCKED
declare -A PLAN_TOTAL

# 2️⃣ Função para resetar cota diária
reset_scrap() {
  echo "♻️  Resetando cota de raspagem..."
  curl -s -X POST "$API_URL/scrap-dev/reset-scrap" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" | jq
  echo "--------------------------------------------"
}

# 3️⃣ Função para upgrade de plano
upgrade_plan() {
  local plan=$1
  echo "➡️  Fazendo upgrade para: $plan"
  curl -s -X PUT "$API_URL/subscriptions/upgrade" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"plan\":\"$plan\"}" | jq
  echo "--------------------------------------------"
}

# 4️⃣ Função para simular raspagens com contadores
test_scraps() {
  local max=$1
  local plan=$2
  local success=0
  local blocked=0

  echo "🧪 Testando $max raspagens no plano $plan..."
  echo "--------------------------------------------"

  for ((i=1;i<=$max;i++)); do
    result=$(curl -s -X GET "$API_URL/scrap" \
      -H "Authorization: Bearer $TOKEN")

    if [[ "$result" == *"blocked"* || "$result" == *"limit"* || "$result" == *"quota"* ]]; then
      echo "🚫 Raspagem #$i BLOQUEADA → $result"
      ((blocked++))
    else
      echo "✅ Raspagem #$i OK → $result"
      ((success++))
    fi

    sleep 1
  done

  PLAN_SUCCESS[$plan]=$success
  PLAN_BLOCKED[$plan]=$blocked
  PLAN_TOTAL[$plan]=$max

  echo "--------------------------------------------"
  echo "Resumo $plan → Sucesso: $success | Bloqueadas: $blocked | Total: $max"
  echo "--------------------------------------------"
}

# 5️⃣ Fluxo completo
plans=("bronze" "silver" "gold" "infinity")
tests=(15 25 55 60)

for i in "${!plans[@]}"; do
  plan=${plans[$i]}
  max=${tests[$i]}
  reset_scrap
  upgrade_plan "$plan"
  test_scraps "$max" "$plan"
done

# 6️⃣ Resumo geral
echo ""
echo "============================================"
echo "📊 RESUMO FINAL DOS TESTES"
echo "============================================"

for plan in "${plans[@]}"; do
  success=${PLAN_SUCCESS[$plan]}
  blocked=${PLAN_BLOCKED[$plan]}
  total=${PLAN_TOTAL[$plan]}
  echo "🪙 $plan → ✅ $success / 🚫 $blocked / 🔢 $total"
done

echo "============================================"
echo "🎉 Teste de fluxo de planos finalizado!"
echo "============================================"
