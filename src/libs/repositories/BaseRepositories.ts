import { eq, and, SQL } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';


class BaseRepository<T extends PgTable, K> {
    private table: T;
    private db: NodePgDatabase<typeof schema>;

    constructor(table: T, db: NodePgDatabase<typeof schema>) {
        this.table = table;
        this.db = db;
    }

    async create(values: T["$inferInsert"]): Promise<K> {
        const insertedRecords = await this.db
            .insert(this.table)
            .values(values)
            .returning();
        return insertedRecords[0] as K;
    }

    async find(whereClause: Partial<K>): Promise<K[]> {
        const conditions: SQL<unknown>[] = Object.keys(whereClause).map(key => eq(this.table[key], whereClause[key]));

        const result = await this.db
            .select()
            .from(this.table)
            .where(conditions.length > 1 ? and(...conditions) : conditions[0]);

        return result as K[];
    }

    async findById(id: number): Promise<K | null> {
        const result = await this.db
            .select()
            .from(this.table)
            .where(eq(this.table['id'], id));
        return result[0] as K || null;
    }

    async update(id: number, values: Partial<K>): Promise<void> {
        await this.db
            .update(this.table)
            .set(values)
            .where(eq(this.table['id'], id));
    }

    async delete(id: number): Promise<void> {
        await this.db
            .delete(this.table)
            .where(eq(this.table['id'], id));
    }
}

export default BaseRepository;
