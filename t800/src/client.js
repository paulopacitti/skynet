const grpc = require('@grpc/grpc-js');
const protoLoader = require("@grpc/proto-loader");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("src/protos/chat.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
);

const REMOTE_SERVER = process.env.SERVER_ADDRESS;
console.log(process.env.SERVER_ADDRESS);
const client = new proto.Chat(
  REMOTE_SERVER,
  grpc.credentials.createInsecure()
);

let username;

//When server send a message
function onData(message) {
  if (message.user == username)
    return;
  console.log(`${message.user}: ${message.text}`);
}

//Start the stream between server and client
function startChat() {
  let channel = client.join({ user: username });
  channel.on("data", onData);
  rl.on("line", text => client.send({ user: username, text: text }, res => {}));
}

//Ask user name than start the chat
rl.question("What's ur name? ", answer => {
  username = answer;

  startChat();
});