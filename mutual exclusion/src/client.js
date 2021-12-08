const grpc = require('@grpc/grpc-js');
const protoLoader = require("@grpc/proto-loader");

const proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("protos/mutual_exclusion.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
);

const REMOTE_SERVER = "localhost:3000";
const client = new proto.MutualExclusion(
  REMOTE_SERVER,
  grpc.credentials.createInsecure()
);
const sender = generateUUID();
const availableResources = [1, 2, 3];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

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

function getResourcesNeeded() {
  const length = Math.floor(Math.random() * 10 + 1); //Quantidade de recursos que serão utilizados pelo processo
  const resources = []
  
  for (let i = 0; i < length; i++) {
    resources.push(availableResources[getRandomInt(0, availableResources.length)]);
  }

  return [1,1,2];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function useResource(resource) {
  return new Promise(async (res, rej) => {
    await sleep(2000);
    client.freeResource({ resource: resource, requesterId: sender }, () => {});
    console.log(`${sender} is no longer using resource ${resource}`);
    res();
  });
}

async function main() {
  const resources = getResourcesNeeded();
  let resourcesToBeUsedCounter = resources.length;
  let usedResourcesCounter = 0;
  let currentResourceCounter = -1;
  let shouldStopLoop = false

  console.log(`Hello, I'm ${sender}`);
  console.log("The resources I want to use are ", resources);
  while (!shouldStopLoop) {
    await sleep(30);
    if (currentResourceCounter !== usedResourcesCounter) {
      currentResourceCounter = usedResourcesCounter;
      console.log(`${sender} is requesting resource: ${resources[currentResourceCounter]}`);
      let connection = client.requestResource({ 
        resource: resources[currentResourceCounter],
        requesterId: sender
      }, () => {});
      connection.on("data", async (message) => {
        const { resource, requesterId } = message;
        console.log(`${sender} is now using resource: ${resource}`);
        await useResource(resource);
        usedResourcesCounter += 1;
        if (usedResourcesCounter == resourcesToBeUsedCounter - 1) {
          shouldStopLoop = true;
        }
      });
    }
  }
  return;
}

main();