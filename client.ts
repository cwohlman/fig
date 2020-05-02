import { Store } from "./server";

export default function createClient(configuration: ClientConfiguration) {
  return new FigClient(configuration);
}

export type ClientConfiguration = {
  store: Store,
  subscriptions: FigHost[]
}
export type FigHost = string;

export class FigClient {
  constructor(
    configuration: ClientConfiguration
  ) {
    this.store = configuration.store;
    this.subscriptions = configuration.subscriptions;
  }
  store: Store;
  subscriptions: string[];

  refresh() {
    // Should fetch new mesages from each host in the subscriptions list
    throw new Error("Not implemented")
  }
}