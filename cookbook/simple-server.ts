import { Store, PublicKey, Fig } from "../src/core";
import createDefaultHandler from "../src/server";

export default function createSimpleServer(
  store: Store,
  trustedKeys: PublicKey[]
) {
  const fig = new Fig({
    store,
    trustedKeys,
    middleware: [
      // TODO: the simple server should validate keys
    ],
  });

  return createDefaultHandler(fig);
}
