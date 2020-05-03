import { FigHost, FigFeed } from "./feed";
import { Store, Middleware, PublicKey, Record } from "./core";
import { SecretKey, FigIssuer, Message } from "./issuer";

export default function createClient(browser: Browser, host: FigHost, middlewares: Middleware[], feedMiddlewares: Middleware[]) {
  const configurationLocalstorageKey = 'fig.configuration';
  const configurationStore: ConfigStore = {
    getConfiguration() {
      const value = browser.localStorage.getItem(configurationLocalstorageKey);
      if (value) {
        return JSON.parse(value) as ClientConfig;
      }
      return null;
    },
    setConfiguration(config: ClientConfig) {
      browser.localStorage.setItem(configurationLocalstorageKey, JSON.stringify(config));
    }
  };
  const tokensLocalstorageKey = 'fig.tokens';
  const tokenStoreBacking = {
    load() {
      const value = browser.localStorage.getItem(tokensLocalstorageKey);
      if (value) {
        return JSON.parse(value) as Record[];
      }
      return [];
    },
    save(tokens: Record[]) {
      browser.localStorage.setItem(tokensLocalstorageKey, JSON.stringify(tokens));
    },
  }
  let tokens = tokenStoreBacking.load();
  const tokenStore: LocalStore = {
    getById(id: string) {
      return tokens.find(t => t.id == id) || null;
    },
    query(query) {
      const limit = query.limit || 100;
      if (query.after) {
        const index = tokens.findIndex(t => t.id === query.after);
        return tokens.slice(index, index + limit);
      }

      return tokens.slice(-limit);
    },
    insert(record) {
      tokens.push(record);
      setTimeout(() => tokenStoreBacking.save(tokens), 0);
    },
    reset() {
      tokens = [];
      setTimeout(() => tokenStoreBacking.save(tokens), 0);
    }
  };
  return new Client({
    tokenStore,
    configurationStore,
    issuer: host,
    middlewares,
    feedMiddlewares,
  });
}

export function createScopedClient(scope: string, browser: Browser, host: FigHost) {
  // Just provide mock localStorage & indexDb which prefix the keys with the scope string
  throw new Error("Not implemented")
}

export type Browser = {
  localStorage: WindowLocalStorage["localStorage"],
  indexDb: IDBFactory // TODO: use this once we support an async store
}

export type ConfigStore = {
  getConfiguration(): ClientConfig | null,
  setConfiguration(config: ClientConfig): void,
}

export type ClientConfig = {
  subscriptions: FigHost[],
  signingKey: SecretKey,
  publicKey: PublicKey,
}

export type LocalStore = Store & { reset(): void }

export type ClientParams = {
  tokenStore: Store | LocalStore,
  configurationStore: ConfigStore,
  issuer: FigHost,
  middlewares: Middleware[],
  feedMiddlewares: Middleware[],
}

export class Client {
  constructor(params: ClientParams) {
    this.params = params;
    this.config = params.configurationStore.getConfiguration();
    if (! this.config) {
      this.initializeConfig();
    }
    this.initializeFeed();
    this.initializeIssuer();
  }

  feed: FigFeed;
  issuer: FigIssuer;
  config: ClientConfig;
  params: ClientParams;

  private initializeConfig() {
    const [publicKey, secretKey] = FigIssuer.createKey();
    this.config = {
      subscriptions: [this.params.issuer],
      signingKey: secretKey,
      publicKey: publicKey,
    };
    this.params.configurationStore.setConfiguration(this.config);
  }

  subscribe(host: FigHost) {
    this.config.subscriptions = this.config.subscriptions.concat(host);
    this.params.configurationStore.setConfiguration(this.config);
    this.initializeFeed();
  }

  post(messageParts: Message[]) {
    const token = this.issuer.signMessage(messageParts);
    this.feed.accept([token]);
  }

  reset() {
    this.initializeConfig();
    if ('reset' in this.params.tokenStore) {
      this.params.tokenStore.reset();
    }
  }

  initializeFeed() {
    this.feed = new FigFeed({
      store: this.params.tokenStore,
      subscriptions: this.config.subscriptions,
      trustedKeys: [this.config.publicKey],
      middleware: this.params.middlewares,
      readMiddlewares: this.params.feedMiddlewares,
    });
  }
  initializeIssuer() {
    this.issuer = new FigIssuer({
      signingKey: this.config.signingKey,
      issuer: this.params.issuer,
    });
  }
}