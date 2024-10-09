import { type PgTable, PgUpdateSetSource } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export interface QueryCriteria {
    limit?: number;
    offset?: number;
}

export interface DrizzleRepository<T extends PgTable, ID extends keyof T["$inferSelect"], U> {
    findAll(): Promise<U[]>; // Return entity type U (e.g., User)

    findById(id: T["$inferSelect"][ID]): Promise<U | null>; // Return entity type U or null

    update(id: T["$inferSelect"][ID], data: PgUpdateSetSource<T>): Promise<U>; // Return updated entity type U

    create(data: InferInsertModel<T>): Promise<U>; // Return created entity type U

    delete(id: T["$inferSelect"][ID]): Promise<void>;

    list(
        where?: Partial<U>,  // Use U for the type in the where clause
        limit?: number,
        page?: number
    ): Promise<U[]>; // Return entity type U
}
