# MC714 - 2021.2 | Avaliação II
- **Nome** Paulo Pacitti  **RA** 185447
- **Nome** Gabriel Borges **RA** 197458

## Algoritmo de Lamport
- Disponível na pasta `lamport/` do repositório.
- Baseado no código de Luana Barros disponível em: https://github.com/httplups/lamport-clock
- Apesar de ser baseado na implementação da Luana, nós refizemos toda a implementação que foi feita em Python e WebSockets para Node.js e gRPC.
- Instalação:
  - Ter o Node.js LTS mais recente instalado na sua máquina;
  - Instalar as dependências com npm install no diretório  `lamport/` do repositório.
- Execução:
  - Na pasta  `lamport/src`, rodar o servidor com o seguinte comando: `node server.js`.
  - Na pasta  `lamport/src`, em outro shell (quantos clientes quiser, um por shell), iniciar o cliente com o comando `node client.js`.

## Algoritmo de Exclusão Mútua
- Disponível na pasta `mutual-exclusion/` do repositório.
- Baseado somente no conteúdo teórico da disciplina.
- Instalação:
  - Ter o Node.js LTS mais recente instalado na sua máquina;
  - Instalar as dependências com `npm install` no diretório  `mutual-exclusion/` do repositório.
- Execução:
  - Na pasta `mutual-exclusion/src` , rodar o servidor com o seguinte comando: `node server.js`.
  - Na pasta `mutual-exclusion/src`, em outro shell (quantos clientes quiser, um por shell), iniciar o cliente com o comando `node client.js`.




