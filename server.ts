export default function createFig(params: Configuration): Fig {
  return new Fig(params);
}

export type Message = {
  token: string,
  id: string,
  acceptedAt: Date,
  parsed: Metadata,
  metadata: Metadata,
};
export type Metadata = {
  [key: string]: any;
};
export type PublicKey = {
  public_key: string,
  id: string,
};
export type Middleware = (
  record: Message
) => Message | null

export type Configuration = {
  store: Store
  trustedKeys: PublicKey[]
  middleware: Middleware[]
}
export type Query = {
  limit?: number,
  after?: string,
} | {
  keys: true
};
export type Store = {
  getById(id: string): Message | null;
  query(query: Query): Message[];
  insert(messages: Message[]): void;
};

export class Fig {
  constructor({ store, trustedKeys, middleware }: Configuration) { 
    this.store = store;
    this.trustedKeys = trustedKeys;
    this.middleware = [createKeyMiddleware(() => this.trustedKeys)].concat(middleware);
  }

  store: Store;
  trustedKeys: PublicKey[];
  middleware: Middleware[];

  getById(id: string): Message | null {
    return this.store.getById(id);
  }
  query(query: Query): Message[] {
    return this.store.query(query);
  }

  accept(tokens: string[]) {
    this.insert(
      tokens.map(token => this.validate(token)).filter(a => a)
    )
  }
  validate(token: string): Message | null {
    const id = getIdFromToken(token);
    if (! id) {
      return null;
    }
    let result: Message = { id, token, parsed: {}, metadata: {}, acceptedAt: new Date() };
    for (const middleware of this.middleware) {
      result = middleware(result);
      if (! result) {
        return null;
      }
    }
    return result as Message;
  }
  insert(messages: Message[]) {
    return this.store.insert(messages);
  }

  express() {
    return (req, res) => {
      throw new Error('Not implemented');
    }
  }
}

export function getIdFromToken(token: string): string {
  throw new Error('Not implemented');
}

export function createKeyMiddleware(getTrustedKeys: () => PublicKey[]) {
  throw new Error('Not implemented')
}
