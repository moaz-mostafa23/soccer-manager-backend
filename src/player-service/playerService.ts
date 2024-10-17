import { getRandomCountry } from '../team-service/utils';
import PlayerRepository from './playerRepository';
import { v4 as uuidv4 } from 'uuid';
import { NotFound } from 'http-errors';

class PlayerService {

    constructor(
        private playerRepository = PlayerRepository,
    ) { }

    async generatePlayersForTeam(teamId: string) {
        const positions = {
            Goalkeeper: 3,
            Defender: 6,
            Midfielder: 6,
            Attacker: 5,
        };

        const playerPositions: string[] = [];

        for (const [position, count] of Object.entries(positions)) {
            for (let i = 0; i < count; i++) {
                playerPositions.push(position);
            }
        }

        const players = playerPositions.map((position) => ({
            id: uuidv4(),
            team_id: teamId,
            first_name: `${Math.random().toString(36).substring(7)}`, //ik the names generated will be very weird but it's okay, they can be russian names
            last_name: `${Math.random().toString(36).substring(7)}`,
            country: getRandomCountry(),
            age: Math.floor(Math.random() * 23) + 18,
            position: position,
            market_value: '1000000',
        }));

        return await this.playerRepository.batchCreatePlayers(players);
    }

    async getPlayersByTeam(teamId: string) {
        return await this.playerRepository.getPlayersByTeamId(teamId);
    }

    async placePlayerOnTransferList(playerId: string, askingPrice: string) {
        const player = await this.playerRepository.findById(playerId);
        if (!player) throw new NotFound('Player not found');

        await this.playerRepository.update(playerId, { market_value: askingPrice }); //only players with a market value can be placed on the transfer list

        return player;
    }

    async transferPlayer(playerId: string, newTeamId: string, askingPrice: string) {
        const player = await this.playerRepository.findById(playerId);
        if (!player) throw new NotFound('Player not found');


        const randomIncreaseFactor = 1 + Math.random() * (1 - 0.1);
        const newMarketValue = (parseFloat(askingPrice) * randomIncreaseFactor).toFixed(2);


        await this.playerRepository.transferPlayer(playerId, newTeamId, newMarketValue);

        return {
            playerId,
            newTeamId,
            newMarketValue,
        };
    }

    async getPlayer(playerId: string) {
        const player = await this.playerRepository.findById(playerId);
        if (!player) throw new NotFound('Player not found');
        return player;
    }
}

export default new PlayerService();
