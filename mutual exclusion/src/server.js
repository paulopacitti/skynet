let grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("./protos/mutual_exclusion.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
);

const server = new grpc.Server();
const SERVER_ADDRESS = "localhost:3000";
server.addService(
  proto.MutualExclusion.service, { 
      requestResource: requestResource, 
      freeResource: freeResource 
    }
  );

const resourcesIds = [1, 2, 3];
const resourcesAllocation = new Object();
const resourcesQueue = new Object();

function manageResourceAllocation() {
  console.log(``);
  console.log(``);
  console.log(`#############################`);
  resourcesIds.forEach(resourceId => {
    const isResourceFree = resourcesAllocation[resourceId] == null
    const candidate = resourcesQueue[resourceId].length > 0 ? resourcesQueue[resourceId][0] : null

    if (isResourceFree && !!candidate) {
      resourcesQueue[resourceId].shift();
      resourcesAllocation[resourceId] = candidate;
      candidate.write({ resource: resourceId, requesterId: candidate.request.requesterId });
    }

    console.log(`Resource ${resourceId} being used by ${resourcesAllocation[resourceId]?.request?.requesterId}`);
    console.log(`Resource ${resourceId} queue is `);
    resourcesQueue[resourceId].forEach(user => {
      console.log(user.request.requesterId);  
    });
  });
  console.log(`#############################`);
  console.log(``);
  console.log(``);
}

function requestResource(call, callback) {
  const { resource, requesterId } = call.request;
  resourcesQueue[resource].push(call);
  console.log(`Resource ${resource} has been requested by ${requesterId}`);
  manageResourceAllocation();
}

function freeResource(call, callback) {
  const { resource, requesterId } = call.request;
  const currentResourceUserId = resourcesAllocation[resource]?.request?.requesterId;

  if (currentResourceUserId == requesterId) {
    resourcesAllocation[resource] = null;
    console.log(`Resource ${resource} is now free. ${requesterId} no longer uses it`);
    manageResourceAllocation();
  }
  callback(null, {});
}

server.bindAsync(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure(), () => {
  server.start();
  resourcesIds.forEach(resourceId => {
    resourcesAllocation[resourceId] = null;
    resourcesQueue[resourceId] = [];
  });
  console.log("Server started");
});