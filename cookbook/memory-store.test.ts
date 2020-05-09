import createMemoryStore from "./memory-store";

describe("createMemoryStore", function () {
  describe("store.getById", function () {
    it("should return the record with the specified id", function () {
      const store = createMemoryStore([
        {
          id: "1",
          token: "x",
          metadata: {},
          parsed: {},
          acceptedAt: new Date(),
        },
      ]);

      expect(store.getById("1")).toBeTruthy();
      expect(store.getById("1")?.id).toBeTruthy();
    });
  });
  describe("store.query", function () {
    it("should return records from the end of the list when passed a limit", function () {
      const store = createMemoryStore([
        {
          id: "1",
          token: "x",
          metadata: {},
          parsed: {},
          acceptedAt: new Date(),
        },
        {
          id: "2",
          token: "x",
          metadata: {},
          parsed: {},
          acceptedAt: new Date(),
        },
      ]);

      const results = store.query({
        limit: 1,
      });

      expect(results).toHaveLength(1);
      expect(results[0].id).toEqual("2");
    });
    it("should return records starting at the specified after (not inclusive)", function () {
      const store = createMemoryStore([
        {
          id: "1",
          token: "x",
          metadata: {},
          parsed: {},
          acceptedAt: new Date(),
        },
        {
          id: "2",
          token: "x",
          metadata: {},
          parsed: {},
          acceptedAt: new Date(),
        },
        {
          id: "3",
          token: "x",
          metadata: {},
          parsed: {},
          acceptedAt: new Date(),
        },
      ]);

      const results = store.query({
        after: "2",
      });

      expect(results).toHaveLength(1);
      expect(results[0].id).toEqual("3");
    });
    it("should return a limited number of records starting at the specified after", function () {
      const store = createMemoryStore([
        {
          id: "1",
          token: "x",
          metadata: {},
          parsed: {},
          acceptedAt: new Date(),
        },
        {
          id: "2",
          token: "x",
          metadata: {},
          parsed: {},
          acceptedAt: new Date(),
        },
        {
          id: "3",
          token: "x",
          metadata: {},
          parsed: {},
          acceptedAt: new Date(),
        },
      ]);

      const results = store.query({
        after: "1",
        limit: 1,
      });

      expect(results).toHaveLength(1);
      expect(results[0].id).toEqual("2");
    });
  });
});
