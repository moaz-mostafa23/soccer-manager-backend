import { BaseRepository } from './BaseRepository';
import { eq, SQL, sql } from 'drizzle-orm';
import db from '../config/drizzle.config';
import { PgTable, PgUpdateSetSource } from 'drizzle-orm/pg-core';
import { QueryCriteria } from '../common/interfaces';

export interface Entity<ID> {
    id: ID;
}

export abstract class DrizzleRepository<M extends PgTable, U extends Entity<string>>
    implements BaseRepository<U> {

    protected constructor(
        protected readonly drizzleDb: typeof db,
        protected readonly schema: M,
        protected readonly primaryKey: keyof U
    ) { }

    async create(data: Partial<U>): Promise<U> {
        const transformedData = Object.keys(data).reduce((acc, key) => {
            acc[key as keyof M["$inferInsert"]] = sql`${data[key as keyof M["$inferInsert"] as keyof U]}`;
            return acc;
        }, {} as { [Key in keyof M["$inferInsert"]]: SQL<unknown> });

        const result = await this.drizzleDb
            .insert(this.schema)
            .values(transformedData)
            .returning();

        return result[0] as unknown as U;
    }

    async findAll(): Promise<U[]> {
        const result = await this.drizzleDb.select().from(this.schema);
        return result as U[];
    }

    async findById(id: string): Promise<U | null> {
        const result = await this.drizzleDb
            .select()
            .from(this.schema)
            .where(eq((this.schema as any)[this.primaryKey], id));
        return result.length > 0 ? result[0] as U : null;
    }


    async update(id: string, data: PgUpdateSetSource<M>): Promise<U> {
        const record = await this.findById(id);

        await this.drizzleDb
            .update(this.schema)
            .set(data)
            .where(eq((this.schema as any)[this.primaryKey], id));

        const updatedRecord = await this.findById(id);

        return updatedRecord as unknown as Promise<U>;
    }

    async delete(id: string): Promise<void> {
        await this.drizzleDb.delete(this.schema).where(eq(sql`${this.primaryKey}`, id));
    }

    async list(
        where?: Partial<U>,
        criteria?: QueryCriteria
    ): Promise<U[]> {
        let query: any = this.drizzleDb.select().from(this.schema);

        if (where) {
            for (const [key, value] of Object.entries(where)) {
                query = query.where(eq((this.schema as any)[key], value as any));
            }
        }

        if (criteria?.limit) {
            query = query.limit(criteria.limit);
        }
        if (criteria?.offset) {
            query = query.offset(criteria.offset);
        }

        const result = await query;
        return result as U[];
    }
}
