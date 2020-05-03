import { FigHost, FigFeed } from "./feed";
import { Store, Middleware, PublicKey } from "./server";
import { SecretKey, FigIssuer } from "./issuer";

export default function createClient() {

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

export type ClientParams = {
  tokenStore: Store,
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
      const [publicKey, secretKey] = FigIssuer.createKey();
      this.config = {
        subscriptions: [this.params.issuer],
        signingKey: secretKey,
        publicKey: publicKey,
      }
      this.params.configurationStore.setConfiguration(this.config);
    }
    this.initializeFeed();
    this.initializeIssuer();
  }

  feed: FigFeed;
  issuer: FigIssuer;
  config: ClientConfig;
  params: ClientParams;

  subscribe(host: FigHost) {
    this.config.subscriptions = this.config.subscriptions.concat(host);
    this.params.configurationStore.setConfiguration(this.config);
    this.initializeFeed();
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