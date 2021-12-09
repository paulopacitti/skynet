## Bully's Algorithm

- Baseado no código Johan Hellgren disponível em: https://github.com/hellgrenj/node-bully 
- As alterações feitas foram para adaptar ao funcionamento com a nova versão do Node.js e com a nova versão da API da lib de gRPC para Node.js.
- Instalação:
  - Ter o Node.js LTS mais recente instalado na sua máquina.
  - Instalar as dependências com npm install no diretório `bully/` do repositório.
- Execução:
- Rodar, a partir do diretório `bully/` o comando `node src/gRPCWrapper.js 50052`, onde `50052` é a porta desejada para executar o servidor gRPC do nó. Cada nó do algoritmo de Bully representa uma execução do código. Então é necessário abrir um por shell para simular múltiplos nós na eleição;
- É necessário, assim como mostrado no vídeo, informar aos nós as portas participantes no algoritmo de eleição. Assim, deve-se chamar a rotina addPeers definido no protobuffer para cada nó, como mostrado no vídeo. Isso pode ser feito de diversas maneiras, mas o jeito que fizemos foi utilizar o cliente REST [Insomnia](https://insomnia.rest/) e adicionar o request para a porta desejada. Na pasta raiz do repositório, há um arquivo chamado `Insomnia.json`. Basta importar ao Insomnia que o request já estará pronto para executar, basta mudar o body com as portas desejadas e o endereço na barra de endereços para escolher para qual nó você deseja informar aqueles que participam da eleição.
- Após isso, basta "matar" nós-líder a fim de observar a eleição :)