#!/bin/bash
# =========================================================
# 🧪 TESTE AUTOMATIZADO DE RASPAGEM + COTAS (VENDAPRAGRINGA)
# =========================================================
# Autor: Jarbas (assistente técnico)
# Local: /home/gus/Documentos/vendapragringa/scripts/test-scrap-flow.sh
# ---------------------------------------------------------

API_URL="http://localhost:3333"
TEST_EMAIL="user@teste.com"
TEST_PASSWORD="123456"
COOKIE_FILE="./cookie.txt"
TOKEN_FILE="./token.txt"

echo "🔧 Limpando arquivos antigos..."
rm -f $COOKIE_FILE $TOKEN_FILE

echo "==========================================================="
echo "1️⃣  TESTE: RASPAGEM ANÔNIMA /scrap/once"
echo "==========================================================="

curl -s -c $COOKIE_FILE "$API_URL/scrap/once?url=https://produto.mercadolivre.com.br/MLB-123456789" | jq .
sleep 1

echo
echo "2️⃣  TENTATIVA DE SEGUNDA RASPAGEM (DEVE FALHAR)"
curl -s -b $COOKIE_FILE "$API_URL/scrap/once?url=https://produto.mercadolivre.com.br/MLB-987654321" | jq .
sleep 1

echo
echo "3️⃣  RESETANDO FLAG DE RASPAGEM (modo dev)"
curl -s -X POST "$API_URL/scrap-dev/reset-once" -b $COOKIE_FILE | jq .
sleep 1

echo
echo "==========================================================="
echo "4️⃣  LOGIN DO USUÁRIO DE TESTE"
echo "==========================================================="

LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/sessions" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Erro ao autenticar. Verifique email/senha."
  echo "$LOGIN_RESPONSE"
  exit 1
fi

echo "$TOKEN" > $TOKEN_FILE
echo "✅ Token obtido e salvo."

sleep 1

echo
echo "==========================================================="
echo "5️⃣  RASPAGEM LOGADA DENTRO DA COTA"
echo "==========================================================="

curl -s -H "Authorization: Bearer $TOKEN" \
  "$API_URL/scrap?url=https://produto.mercadolivre.com.br/MLB-123456789" | jq .
sleep 1

echo
echo "6️⃣  ESTOURANDO COTA — (rodando várias raspagens até erro)"
for i in {1..8}; do
  echo "➡️ Raspagem #$i"
  curl -s -H "Authorization: Bearer $TOKEN" \
    "$API_URL/scrap?url=https://produto.mercadolivre.com.br/MLB-123456789$i" | jq .
  sleep 0.5
done

echo
echo "==========================================================="
echo "7️⃣  RESETANDO COTAS DO USUÁRIO (modo dev)"
echo "==========================================================="

curl -s -X POST "$API_URL/scrap-dev/reset-scrap" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\"}" | jq .

echo
echo "==========================================================="
echo "8️⃣  LISTANDO ITENS CRIADOS"
echo "==========================================================="

curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/items" | jq .

echo
echo "==========================================================="
echo "✅ TESTE FINALIZADO"
echo "==========================================================="
