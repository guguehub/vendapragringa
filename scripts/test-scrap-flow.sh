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
LOG_FILE="./logs/test-scrap-flow.log"

mkdir -p ./logs

echo "🔧 Limpando arquivos antigos..."
rm -f $COOKIE_FILE $TOKEN_FILE
echo "" > $LOG_FILE

function log {
  echo -e "$1" | tee -a $LOG_FILE
}

function divider {
  log "\n==========================================================="
}

log "🚀 Iniciando teste automatizado de raspagem (VENDAPRAGRINGA)..."
sleep 1

divider
log "1️⃣  TESTE: RASPAGEM ANÔNIMA (/scrap/once)"
divider

curl -s -c $COOKIE_FILE "$API_URL/scrap/once?url=https://produto.mercadolivre.com.br/MLB-123456789" | jq . | tee -a $LOG_FILE
sleep 1

divider
log "2️⃣  TENTATIVA DE SEGUNDA RASPAGEM (DEVE FALHAR)"
divider

curl -s -b $COOKIE_FILE "$API_URL/scrap/once?url=https://produto.mercadolivre.com.br/MLB-987654321" | jq . | tee -a $LOG_FILE
sleep 1

divider
log "3️⃣  RESETANDO FLAG DE RASPAGEM (modo dev)"
divider

curl -s -X POST "$API_URL/scrap-dev/reset-once" -b $COOKIE_FILE | jq . | tee -a $LOG_FILE
sleep 1

divider
log "4️⃣  LOGIN DO USUÁRIO DE TESTE"
divider

LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/sessions" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  log "❌ Erro ao autenticar. Verifique email/senha."
  echo "$LOGIN_RESPONSE" | tee -a $LOG_FILE
  exit 1
fi

echo "$TOKEN" > $TOKEN_FILE
log "✅ Token obtido e salvo com sucesso."
sleep 1

divider
log "5️⃣  RESETANDO COTAS DO USUÁRIO (modo dev)"
divider

curl -s -X POST "$API_URL/scrap-dev/reset-scrap" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\"}" | jq . | tee -a $LOG_FILE
sleep 1

divider
log "6️⃣  RASPAGEM LOGADA DENTRO DA COTA"
divider

curl -s -H "Authorization: Bearer $TOKEN" \
  "$API_URL/scrap?url=https://produto.mercadolivre.com.br/MLB-123456789" | jq . | tee -a $LOG_FILE
sleep 1

divider
log "7️⃣  ESTOURANDO COTA — (rodando várias raspagens até erro)"
divider

success=0
blocked=0
total=8

for i in $(seq 1 $total); do
  log "➡️ Raspagem #$i"
  response=$(curl -s -H "Authorization: Bearer $TOKEN" \
    "$API_URL/scrap?url=https://produto.mercadolivre.com.br/MLB-123456789$i")

  echo "$response" | jq . | tee -a $LOG_FILE

  if echo "$response" | grep -qiE "blocked|limit|quota"; then
    ((blocked++))
  else
    ((success++))
  fi
  sleep 1
done

divider
log "📊 RESULTADOS DAS RASPAGENS"
log "✅ Sucesso: $success"
log "🚫 Bloqueadas: $blocked"
log "🔢 Total tentadas: $total"

divider
log "8️⃣  LISTANDO ITENS CRIADOS"
divider

curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/items" | jq . | tee -a $LOG_FILE
sleep 1

divider
log "9️⃣  VERIFICANDO STATUS DE COTA DO USUÁRIO (pós-teste)"
divider

curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/user-quota" | jq . | tee -a $LOG_FILE

divider
log "✅ TESTE FINALIZADO COM SUCESSO!"
divider

log "📁 Log salvo em: $LOG_FILE"
