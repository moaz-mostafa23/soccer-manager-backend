import { PgUpdateSetSource, type PgTable } from "drizzle-orm/pg-core";
import { eq, InferInsertModel, sql } from "drizzle-orm";
import { DrizzleRepository, QueryCriteria } from "./DrizzleRepository";
import db from "../config/drizzle.config";

export abstract class BaseRepository<M extends PgTable, ID extends keyof M["$inferSelect"], U> implements DrizzleRepository<M, ID, U> {

    protected constructor(
        protected readonly drizzleDb: typeof db,
        protected readonly schema: M,
        protected readonly primaryKey: ID
    ) { }

    async create(data: InferInsertModel<M>): Promise<U> {
        const result = await this.drizzleDb
            .insert(this.schema)
            .values({ ...data })
            .returning();

        return result[0] as U;
    }

    async findAll(): Promise<U[]> {
        const result = await this.drizzleDb.select().from(this.schema);
        return result as U[];
    }

    async list(
        where?: Partial<U>,
        limit?: number,
        page?: number
    ): Promise<U[]> {
        let query: any = this.drizzleDb.select().from(this.schema);

        if (where) {
            for (const [key, value] of Object.entries(where)) {
                query = query.where(eq((this.schema as any)[key], value as any));
            }
        }

        if (limit !== undefined && page !== undefined) {
            const offset = (page - 1) * limit;
            query = query.limit(limit).offset(offset);
        }

        const result = await query;
        return result as U[];
    }


    async findById(id: M["$inferSelect"][ID]): Promise<U | null> {
        const result = await this.drizzleDb
            .select()
            .from(this.schema)
            .where(eq(sql`${this.primaryKey}`, id));

        return result.length > 0 ? result[0] as U : null;
    }

    async update(id: M["$inferSelect"][ID], data: PgUpdateSetSource<M>): Promise<U> {
        await this.findById(id);
        await this.drizzleDb.update(this.schema).set(data).where(eq(sql`${this.primaryKey}`, id));
        return this.findById(id) as Promise<U>;
    }

    async delete(id: M["$inferSelect"][ID]): Promise<void> {
        await this.drizzleDb.delete(this.schema).where(eq(sql`${this.primaryKey}`, id));
    }
}
