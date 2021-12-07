let grpc = require('@grpc/grpc-js');
const protoLoader = require("@grpc/proto-loader");
//Load protobuf
const proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("./protos/lamport.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
);

const REMOTE_SERVER = "localhost:50051";
const client = new proto.Lamport(
  REMOTE_SERVER,
  grpc.credentials.createInsecure()
);
let counter = 0;
const sender = generateUUID()

function generateUUID(length = 2) {
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    }).substring(0,length);;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sendMessageAsync(message) {
  console.log(`Enviando mensagem '${message}' para ${REMOTE_SERVER} em ${counter}`);
  client.sync({
    sender: sender,
    timestamp: counter,
    message: message
  }, (err, callback) => {
    if (err) {
      console.log(`Erro ao enviar mensagem em ${counter}`);
    } else {
      const { timestamp, message } = callback;
      updateCounterValue(timestamp);
      console.log(`Mensagem '${message}' recebida por ${REMOTE_SERVER} em ${counter - 1}`);
    }
  });
}

function updateCounterValue(serverCounter) {
  counter = Math.max(counter, serverCounter) + 1
}

function getMessages() {
  let array = ["The Strength Of The Human Heart. The Difference Between Us And Machines", "I’ll Be Back.", "Come With Me If You Want To Live.", "Why do you cry", "There's not fate"];
  let currentIndex = array.length,  randomIndex;

  // Embaralha as mensagens
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

async function main() {
  console.log(`Olá, eu sou ${sender}`);
  let messages = getMessages();
  const tick = Math.floor(Math.random() * 10 + 1) // Esse é o incremento aleatório de 1 a 10 do relógio

  for (var i in messages) {
    counter += tick;
    sendMessageAsync(messages[i]);
    await sleep(Math.floor(Math.random() *2500 + 1500)); //Espera entre 1.5s e 4s para reenviar a mensagem
  }
}

main();