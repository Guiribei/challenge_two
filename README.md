# challenge_two

<i>Este repositório contém o backend para a etapa de um processo seletivo da Escribo. É um projeto simples em Node.js.</i>

## Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:
- Node.js
- npm ou yarn
- Docker
- Docker Compose
- Postman (para testar os endpoints)

## Configuração do Ambiente

1. Clone o repositório:
```bash
  git clone https://github.com/Guiribei/challenge_two.git
```
2. Navegue até o diretório do projeto:
```bash
   cd challenge-two
```
3. Instale as dependências:
```bash
   npm install
```

## Criando um .env

As variáveis com dados sensíveis utilizadas tanto pelo compose quanto pela aplicação precisam estar num arquivo .env que não está neste repositório. É preciso criar um arquivo .env que contenha as variáveis:

`POSTGRES_USER=` <br/>
`POSTGRES_PASSWORD=`  <br/>
`POSTGRES_DB=`  <br/>
`POSTGRES_PORT=` <br/>
`POSTGRES_HOST=`  <br/>
`JWT_SECRET=`  <br/>

## Executando o PostgreSQL com Docker Compose

Para iniciar o serviço do PostgreSQL:
```bash
  docker-compose up -d
```
## Executando o ESLint

Para rodar os testes:

```bash
  npm test
```

## Executando a Aplicação Localmente

Para iniciar a aplicação localmente:
```bash
   npm start
```
## Testando os Endpoints com Postman
1. Abra o Postman.
2. Configure as requisições para os endpoints disponíveis.
3. Envie as requisições para testar as funcionalidades da aplicação.
