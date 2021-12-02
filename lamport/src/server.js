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

const server = new grpc.Server();
const SERVER_ADDRESS = "localhost:50051";
server.addService(proto.Lamport.service, { sync: sync });

const sync = (call, callback) => {

};

