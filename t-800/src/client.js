const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = __dirname + '/../protos/hello_world.proto';
let packageDefinition = protoLoader.loadSync(
    PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
});
let hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

function main() {
  let target = 'localhost:50051';
  let client = new hello_proto.Greeter(target, grpc.credentials.createInsecure());
  let user = 'Paulo';
  client.sayHello({name: user}, function(err, response) {
    console.log('Greeting:', response.message);
  });
}

main();