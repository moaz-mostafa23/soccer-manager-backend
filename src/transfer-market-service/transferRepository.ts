import { PlayerTable, Team, TeamTable, TransferListing, TransferListingTable, User, UserTable } from '../libs/db/schema';
import db from '../libs/config/drizzle.config';
import { DrizzleRepository } from '../libs/repositories/DrizzleRepository';
import { ITeamRepository, ITransferRepository } from '../libs/common/interfaces';
import { TransferListingFilters } from './interface';
import { eq, sql, and } from 'drizzle-orm';

class TransferRepository extends DrizzleRepository<typeof TransferListingTable, TransferListing> implements ITransferRepository {
    constructor() {
        super(db, TransferListingTable, 'id');
    }

    async listOnMarket(playerId: string, teamId: string, askingPrice: string) {
        const transferListing = await this.create({
            player_id: playerId,
            team_id: teamId,
            asking_price: askingPrice,
        });

        return transferListing;
    }

    async getListings(filters: TransferListingFilters) {
        const whereConditions: any[] = [];

        if (filters.country) {
            whereConditions.push(eq(PlayerTable.country, filters.country));
        }
        if (filters.teamName) {
            whereConditions.push(eq(TeamTable.name, filters.teamName));
        }
        if (filters.playerName) {
            whereConditions.push(eq(PlayerTable.first_name, filters.playerName));
        }
        if (filters.minPrice) {
            whereConditions.push(sql`${TransferListingTable.asking_price} >= ${filters.minPrice}`);
        }
        if (filters.maxPrice) {
            whereConditions.push(sql`${TransferListingTable.asking_price} <= ${filters.maxPrice}`);
        }

        let query = this.drizzleDb
            .select()
            .from(TransferListingTable)
            .innerJoin(PlayerTable, eq(PlayerTable.id, TransferListingTable.player_id))
            .innerJoin(TeamTable, eq(TeamTable.id, TransferListingTable.team_id))
            .where(and(...whereConditions))
            .limit(filters.limit || 20)
            .offset(filters.offset || 0);

        const result = await query;
        return result;
    }


}

export default new TransferRepository();
