let grpc = require('@grpc/grpc-js');
const protoLoader = require("@grpc/proto-loader");
//Load protobuf
const proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("src/protos/lamport.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
);

const REMOTE_SERVER = process.env.SERVER_ADDRESS;
console.log(process.env.SERVER_ADDRESS);
const client = new proto.Lamport(
  REMOTE_SERVER,
  grpc.credentials.createInsecure()
);