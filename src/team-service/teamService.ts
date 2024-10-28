import TeamRepository from './teamRepository';
import { NotFound } from 'http-errors';
import { getRandomCountry } from './utils';
import PlayerService from '../player-service/playerService';
import { sumBy } from 'lodash';

class TeamService {
    constructor(
        private teamRepository = TeamRepository,
    ) { }

    async createTeamForUser(userId: string, teamName: string) {

        const team = await this.teamRepository.create({
            user_id: userId,
            name: teamName,
            country: getRandomCountry(),
            additional_budget: '5000000', //TODO: i dont like this, maybe change it
        });

        const players = await PlayerService.generatePlayersForTeam(team.id);

        const totalPlayerValue = sumBy(players, (player) => Number(player.market_value));
        const totalTeamValue = totalPlayerValue + Number(team.additional_budget);

        await this.teamRepository.update(team.id, { team_value: totalTeamValue.toString() });

        return { team, players };
    }

    async getTeamWithPlayers(userId: string) {
        const team = await this.teamRepository.findByUserId(userId);

        if (!team) {
            throw new NotFound('Team not found');
        }

        const players = await PlayerService.getPlayersByTeam(team.id);
        return { team, players };
    }

    async updateBudget(teamId: string, amount: number) {
        const team = await this.teamRepository.findById(teamId);

        if (!team) {
            throw new NotFound('Team not found');
        }

        const newBudget = Number(team.additional_budget) + amount;

        await this.teamRepository.update(teamId, { additional_budget: String(newBudget) })
    }
}

export default new TeamService()
