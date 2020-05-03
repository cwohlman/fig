import { FigClient } from "./client"

describe('FigClient', function () {
  it('should return all messages by default', function () {
    const client = new FigClient({
      tokenStore: {
        getById() { return null; },
        query() { return [{ id: '1', token: '', parsed: {}, metadata: {}, acceptedAt: new Date() }] },
        insert() {},
      },
      configurationStore: {
        getConfiguration() { return { signingKey: { secret_key: '' }, publicKey: { id: '', public_key: '' }, subscriptions: [] } },
        setConfiguration() {},
      },
      issuer: 'example.com',
      middlewares: [],
      feedMiddlewares: [],
    });

    expect(client.feed.feed()).toHaveLength(1)
  })
})