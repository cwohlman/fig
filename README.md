# Fig - a distributed social network

# A Work in Progress

- `server.ts` Provides an express.js middleware for accepting & serving fig messages
- `issuer.ts` Provides encapsulation around sigining messages & generating siging keys
- `feed.ts` Provides a feed of messages from one or more hosts
- `client.ts` Combines issuer & feed to let users read & write messages
- `browser.ts` A complete fig client using localstorage and indexDB
