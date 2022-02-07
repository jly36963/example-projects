# grpc

## resources

- [grpc](https://grpc.io/)
- [node-docs](https://grpc.github.io/grpc/node/)
- [grpc-node](https://github.com/grpc/grpc-node)
- [grpc-web](https://github.com/grpc/grpc-web)

### examples

https://github.com/grpc/grpc/tree/v1.43.0/examples/node

## notes

- web apis
  - rest (http + json)
    - pros
      - easy to understand (text protocol)
      - built on http
      - great tooling for testing, introspection, modification
      - loose coupling between client/server
      - high-quality http implementations in every language
    - cons
      - no formal (machine-readable) api contract
        - write client libraries for every language
        - swagger kind of remedies this
      - streaming can be hard
        - bi-directional streaming is impossible
      - inneficient (textual representations aren't optimal for networks)
  - gprc
    - pros
      - high-performance, OS, universal rpc framework
        - http/2
        - protobuf serialization
        - clients open one long-lived connection to a grpc server
          - a new http/2 stream for each RPC call
          - allows simultaneous in-flight RPC calls
        - allows client and server streaming
    - cons
      - [load balancing](https://grpc.io/blog/grpc-load-balancing/)
      - error handling is more difficult
        - message, status only

### RPC

- four RPC types
  - unary
  - client stream
  - server stream
  - bidi stream

### codegen

- doesn't support esm

```sh
npm i -g grpc-tools 
grpc_tools_node_protoc --help
```
