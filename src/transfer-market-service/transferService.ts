import TransferRepository from './transferRepository';
import PlayerService from '../player-service/playerService';
import { NotFound } from 'http-errors';
import { TransferListingFilters } from './interface';
import TeamService from '../team-service/teamService';


export class TransferService {
    constructor(
        private transferRepository = TransferRepository,
        private playerService = PlayerService,
        private teamService = TeamService,
    ) { }

    async listOnMarket(playerId: string, askingPrice: string, teamId: string) {

        const player = await this.playerService.getPlayer(playerId); //can make this generic later on to allow listing other types than players maybe?

        if (!player) {
            throw new NotFound('Player not found');
        }

        const transferListing = await this.transferRepository.listOnMarket(playerId, teamId, askingPrice);

        return transferListing;
    }

    async getTransferList(filters: TransferListingFilters) {
        return this.transferRepository.getListings(filters);
    }

    async buy(listingId: string, buyerTeamId: string) {

        const listing = await this.transferRepository.findById(listingId);

        if (!listing) {
            throw new NotFound('Listing not found');
        }

        const buyerTeam = await this.teamService.getTeamWithPlayers(buyerTeamId);

        if (!buyerTeam) {
            throw new NotFound('Buyer team not found');
        }

        const sellerTeam = await this.teamService.getTeamWithPlayers(listing.team_id);

        if (buyerTeam.team.additional_budget < listing.asking_price) {
            throw new Error('Buyer team does not have enough budget');
        }

        const player = await this.playerService.getPlayer(listing.player_id);

        const randomIncreaseFactor = 1 + (Math.random() * 0.9 + 0.1); //randomly increase player value by 10% to 100%
        const newPlayerValue = Math.round(Number(player.market_value) * randomIncreaseFactor);

        //TODO all the following operations should be done in a transaction, also look into using idempotency keys

        await this.playerService.transferPlayer(player.id, buyerTeamId, newPlayerValue);

        await this.teamService.updateBudget(buyerTeamId, -listing.asking_price);

        await this.teamService.updateBudget(sellerTeam.team.id, Number(listing.asking_price));

        const updatedListing = await this.transferRepository.update(listingId, { is_active: false });

        return updatedListing
    }
}