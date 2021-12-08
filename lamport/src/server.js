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
const server = new grpc.Server();
const SERVER_ADDRESS = "localhost:50051";

let counter = 0;

function updateCounterValue(clientCounter) {
  counter = Math.max(counter, clientCounter) + 1
}

function logReceivedMessage(message, sender) {
  console.log(`Messagem '${message}' recebida de '${sender}' em ${counter}`);
}

const sync = (call, callback) => {
  const { sender, timestamp, message } = call.request;
  updateCounterValue(timestamp);
  logReceivedMessage(message, sender);
  callback(null, {message: message, sender: SERVER_ADDRESS, timestamp: counter});
};

server.addService(proto.Lamport.service, { sync: sync });


server.bindAsync(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure(), () => {
  server.start();
});
