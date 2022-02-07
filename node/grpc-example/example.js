import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'

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

  // Client
  const uri = 'localhost:4000'
  const clientCredentials = grpc.credentials.createInsecure()
  const client = new personProto.Person(uri, clientCredentials)

  // Request
  const people = ['Kakashi', 'Iruka', 'Yamato', 'Itachi']
  const response = await greet(client, people)
  console.log(response)

  // Close
  client.close()
}

main()

// TODO: figure out why request never resolves
async function greet(personClient, personNameList) {
  return new Promise((resolve, reject) => {
    personClient.greet({ personNameList }, (err, res) => {
      console.log(err)
      if (err) reject(err)
      const message = res.getMessage()
      resolve(message)
    })
  })
}