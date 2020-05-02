export default function createFig(params: Configuration): Fig {
  return new Fig(params);
}

export type Record = {
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
  record: Record
) => Record | null

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
  getById(id: string): Record | null;
  query(query: Query): Record[];
  insert(messages: Record[]): void;
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

  getById(id: string): Record | null {
    return this.store.getById(id);
  }
  query(query: Query): Record[] {
    return this.store.query(query);
  }

  accept(tokens: string[]) {
    this.insert(
      tokens.map(token => this.validate(token)).filter(a => a)
    )
  }
  validate(token: string): Record | null {
    const id = getIdFromToken(token);
    if (! id) {
      return null;
    }
    let result: Record = { id, token, parsed: {}, metadata: {}, acceptedAt: new Date() };
    for (const middleware of this.middleware) {
      result = middleware(result);
      if (! result) {
        return null;
      }
    }
    return result as Record;
  }
  insert(messages: Record[]) {
    return this.store.insert(messages);
  }

  express() {
    return (req, res) => {
      // TODO: cors should be open to allow browsers to talk to the server
      throw new Error('Not implemented');
    }
  }
}

export function getIdFromToken(token: string): string {
  throw new Error('Not implemented');
}

export function createKeyMiddleware(getTrustedKeys: () => PublicKey[]): Middleware {
  throw new Error('Not implemented')
}
