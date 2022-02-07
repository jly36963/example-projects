import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'
import { greet } from './greet.js'

const main = async () => {
  // Proto
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const protoPath = join(__dirname, 'person.proto')
  const protoOptions = {
    keepCase: true,
    longs: String,
    enum: String,
    defaults: true,
    oneofs: true,
  }
  const packageDefinition = protoLoader.loadSync(protoPath, protoOptions)
  const personProto = grpc.loadPackageDefinition(packageDefinition).person

  // Server
  let server = new grpc.Server()
  const uri = '0.0.0.0:4000'
  const serverCredentials = grpc.ServerCredentials.createInsecure()
  await bindAsync(server, uri, serverCredentials)
  server.addService(personProto.Person.service, { greet })
  server.start()
  console.log(`Serving on ${uri}`)
}

main()

async function bindAsync(server, uri, serverCredentials) {
  return new Promise((resolve, reject) => {
    server.bindAsync(uri, serverCredentials, (e) => {
      if (e) reject(e)
      resolve()
    })
  })
}
