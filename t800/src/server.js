let grpc = require('@grpc/grpc-js');
const protoLoader = require("@grpc/proto-loader");
//Load protobuf
const proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("src/protos/chat.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
);

const server = new grpc.Server();
const SERVER_ADDRESS = "localhost:50051";
server.addService(proto.Chat.service, { join: join, send: send });

let users = [];

//Receive message from client joining
function join(call, callback) {
  users.push(call);
  notifyChat({ user: "Server", text: "new user joined ..." });
}

//Receive message from client
function send(call, callback) {
  notifyChat(call.request);
}

//Send message to all connected clients
function notifyChat(message) {
  users.forEach(user => {
    user.write(message);
  });
}
server.bindAsync(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure(), () => {
  server.start();
  console.log("Server started");
});
