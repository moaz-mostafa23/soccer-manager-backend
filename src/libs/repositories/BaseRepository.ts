import { QueryCriteria } from "../interfaces";

export interface BaseRepository<T> {
    findAll(criteria?: QueryCriteria): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(entity: Partial<T>): Promise<T>;
    update(id: string, entity: Partial<T>): Promise<T>;
    delete(id: string): Promise<void>;
    list(where?: Partial<T>, criteria?: QueryCriteria): Promise<T[]>;
}
