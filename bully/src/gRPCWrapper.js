'use strict';
const grpcWrapper = {};

let grpc = require('@grpc/grpc-js');
const protoLoader = require("@grpc/proto-loader");
const nodeFactory = require('./Node.js');

const port = process.argv[2]
const nodeId = port;
const relativeElectionResponseTimeout = 100; // will be multiplied by the number of peers

const node = nodeFactory(nodeId, relativeElectionResponseTimeout);
node.events.on('ELECTION', (e) => {
  sendToPeer(e.to, {
    type: 'ELECTION',
    sender: e.from
  });
});
node.events.on('ANSWER', (e) => {
  sendToPeer(e.to, {
    type: 'ANSWER',
    sender: e.from
  });

});
node.events.on('COORDINATOR', (e) => {
  sendToPeer(e.to, {
    type: 'COORDINATOR',
    sender: e.from
  });
});

function inbox(call, callback) {
  if (call.request.type === 'COORDINATOR')
    pingLeaderOnAnInterval();

  node.inbox(call.request.type, {
    sender: parseInt(call.request.sender)
  });
  callback(null, { msg: '' });
}

function ping(call, callback) {
  callback(null, { msg: 'PONG' });
}

function addPeers(call, callback) {
  node.addPeers(call.request.peers.filter(p => p != node.id));
  callback(null, { msg: 'I received the list of nodes, thank you!' });
}

function sendToPeer(port, payload) {
  let client = new proto.Peer('0.0.0.0:' + port, grpc.credentials.createInsecure());
  client.inbox(payload, (err, response) => {});
}

function pingLeaderOnAnInterval() {
  clearInterval(grpcWrapper.pingLeaderInterval);
  grpcWrapper.pingLeaderInterval = setInterval(() => {
    if (node.id !== node.currentLeader) {
      const client = new proto.Peer('0.0.0.0:' + node.currentLeader, grpc.credentials.createInsecure());
      client.ping({ msg: 'ping' }, (err, response) => {
        if (err || response.msg !== 'PONG') {
          return node.removePeer(node.currentLeader);
        }
      });
    }
  }, 500 * node.peers.length);
}

let proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("./src/protos/node.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
);
const server = new grpc.Server();
server.addService(proto.Peer.service, {
  inbox: inbox,
  ping: ping,
  peers: addPeers
});
server.bindAsync('0.0.0.0:' + nodeId, grpc.ServerCredentials.createInsecure(), () => {
  server.start();
});


