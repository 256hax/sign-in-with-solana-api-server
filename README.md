# Sign In with Solana API Server
Express x JWT x Sign In with Solana API server minimal example.  
For experiment purpose only. I highly recommend to do security vulnerability assesments before launch.

## System Process and Program Scope
![System Process](https://github.com/256hax/sign-in-with-solana-api-server/blob/main/docs/screenshot/sytem-process.png?raw=true)

## Tech
- Express.js(API Mode)
- JWT: [node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- Sign: [Sign Message](https://github.com/256hax/solana-anchor-react-minimal-example/blob/main/scripts/solana/spl-token-v0.3.x/createSignMessageUsingNaCl.ts)

## Run
### Run API Server
```
% npm i
% npm run dev
```

### Request API
Import [Postman request](https://github.com/256hax/sign-in-with-solana-api-server/tree/main/docs/postman).  

Then request API using Postman:  
1. http://localhost:4100/auths/create-message
2. http://localhost:4100/auths/sign-message
3. http://localhost:4100/auths/verify-signature
4. http://localhost:4100/auths/sign-in
5. http://localhost:4100/auths/verify-jwt

## TODO
- Follow Sign In With (SIW) standards(EIP-4361)
  - [EIP-4361: Sign-In with Ethereum](https://docs.login.xyz/general-information/siwe-overview/eip-4361)
  - [Phantom Sign In With Solana (EIP-4361 with Solana address & chain-id grammar)](https://docs.phantom.app/ethereum-and-polygon/getting-started/signing-a-message#support-for-sign-in-with-standards)
  - [Implementation example - Web3Auth](https://siws.web3auth.io/creatingsismessage)
- Encrypt JWT using [jose](https://www.npmjs.com/package/jose)

## Another Way
If you need to full-stack, use [Blocksmith-Labs/solana-next-auth](https://github.com/Blocksmith-Labs/solana-next-auth) (build with NextAuth.js and Next.js).