# Fig - a distributed social network

# A Work in Progress

- `server.ts` Provides an express.js handler for accepting & serving fig messages
- `simple-server.ts` Provides a set of default configurations for creating a fig server
- `issuer.ts` Provides encapsulation around sigining messages & generating siging keys
- `feed.ts` Provides a feed of messages from one or more hosts
- `client.ts` Combines issuer & feed to let users read & write messages
- `browser.ts` A complete fig client using localstorage and indexDB
