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
};

// TODO: support async store
export type Store = {
  getById(id: string): Record | null;
  query(query: Query): Record[];
  insert(message: Record): void;
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
  keys(): PublicKey[] {
    return this.trustedKeys;
  }

  accept(tokens: string[]) {
    tokens.forEach(token => {
      const id = getIdFromToken(token);
      if (this.getById(id)) {
        // Token is already processed
        return;
      }
      const validatedToken = this.validate(token);
      if (validatedToken) {
        this.insert(validatedToken);
      }
    })
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
  insert(message: Record) {
    return this.store.insert(message);
  }
}

export function getIdFromToken(token: string): string {
  throw new Error('Not implemented');
}

export function createKeyMiddleware(getTrustedKeys: () => PublicKey[]): Middleware {
  throw new Error('Not implemented')
}
