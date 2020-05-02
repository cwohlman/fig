# Fig - a distributed social network

# A Work in Progress

- `server.ts` Provides an express.js middleware for accepting & serving fig messages
- `issuer.ts` Provides encapsulation around sigining messages & generating siging keys
- `client.ts` Provides encapsulation around subscribing to servers
- `browser.ts` Combines issuer & client to let users read & write messages in the browser
