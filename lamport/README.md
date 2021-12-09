# Algoritmo de Lamport
- Disponível na pasta `lamport/` do repositório.
- Baseado no código de Luana Barros disponível em: https://github.com/httplups/lamport-clock
- Apesar de ser baseado na implementação da Luana, nós refizemos toda a implementação que foi feita em Python e WebSockets para Node.js e gRPC.
- Instalação:
  - Ter o Node.js LTS mais recente instalado na sua máquina;
  - Instalar as dependências com npm install no diretório  `lamport/` do repositório.
- Execução:
  - Na pasta  `lamport/src`, rodar o servidor com o seguinte comando: `node server.js`.
  - Na pasta  `lamport/src`, em outro shell (quantos clientes quiser, um por shell), iniciar o cliente com o comando `node client.js`.

