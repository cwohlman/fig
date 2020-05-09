import { Store, Record, Query } from "../src/core";

export default function createMemoryStore(
  initialRecords: Record[] = []
): Store {
  const records = initialRecords.concat();
  return {
    getById(id: string) {
      return records.find((record) => record.id === id) || null;
    },
    query({ limit, after }: Query) {
      const cursor = after ? records.findIndex((i) => after === i.id) : -1;
      const length = Math.min(limit || 100, 1000);

      if (cursor !== -1) {
        return records.slice(cursor + 1, cursor + 1 + length);
      }

      return records.slice(-length);
    },
    insert(record) {
      records.push(record);
    },
  };
}
