import { PublicKey } from "../src/core";
import createSimpleServer from "./simple-server";
import createMemoryStore from "./memory-store";

export default function createMemoryServer(trustedKeys: PublicKey[]) {
  const memoryStore = createMemoryStore();
  return createSimpleServer(memoryStore, trustedKeys);
}
