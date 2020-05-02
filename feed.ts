import { Store, Middleware, Configuration, FigServer, Record } from "./server";
import { Message } from "./issuer";

export default function createFeed(configuration: FeedConfiguration) {
  return new FigFeed(configuration);
}

export type FeedConfiguration = Configuration & {
  subscriptions: FigHost[],
  readMiddlewares: Middleware[],
}
export type FigHost = string;

export class FigFeed extends FigServer {
  constructor(
    configuration: FeedConfiguration
  ) {
    super(configuration);
    this.subscriptions = configuration.subscriptions;
    this.readMiddlewares = configuration.readMiddlewares;
  }
  subscriptions: string[];
  readMiddlewares: Middleware[];

  feed(): Message {
    throw new Error("Not implemented")
  }

  refresh() {
    // Should fetch new mesages from each host in the subscriptions list and add them to the store
    throw new Error("Not implemented")
  }
}