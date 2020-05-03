import { Fig, Middleware, Configuration, Record } from "./core";

export default function createFeed(configuration: FeedConfiguration) {
  return new FigFeed(configuration);
}

export type FeedConfiguration = Configuration & {
  subscriptions: FigHost[],
  readMiddlewares: Middleware[],
}
export type FigHost = string;

export class FigFeed extends Fig {
  constructor(
    configuration: FeedConfiguration
  ) {
    super(configuration);
    this.subscriptions = configuration.subscriptions;
    this.readMiddlewares = configuration.readMiddlewares;
  }
  subscriptions: string[];
  readMiddlewares: Middleware[];

  feed(): Record[] {
    const items = this.store.query({});

    return items.map(result => {
      for (const middleware of this.middleware) {
        result = middleware(result);
        if (! result) {
          return null;
        }
      }
      return result as Record;
    }).filter(identity);
  }

  refresh() {
    // Should fetch new mesages from each host in the subscriptions list and add them to the store
    throw new Error("Not implemented")
  }
}

function identity<T>(a: T | null): a is T {
  return a != null;
}