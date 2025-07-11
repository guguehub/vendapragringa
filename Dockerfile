# Usa imagem base leve do Node
FROM node:18-alpine

# Instala bash e outras ferramentas básicas
RUN apk add --no-cache bash

# Cria diretório de trabalho e define como diretório atual
WORKDIR /home/node/app

# Copia apenas os arquivos necessários inicialmente para instalar dependências
COPY --chown=node:node package.json yarn.lock ./

# Instala as dependências com yarn
RUN yarn install

# Copia o restante dos arquivos da aplicação
COPY --chown=node:node . .

# Torna o entrypoint executável
RUN chmod +x .docker/entrypoint.sh

# Define usuário não-root por segurança
USER node

# Define o entrypoint (bash script)
ENTRYPOINT [".docker/entrypoint.sh"]
