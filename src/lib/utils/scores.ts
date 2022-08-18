import type { Player } from 'src/types/Player';

const TOTAL_LANES = 3;

export function calcTotalScore(player: Player) {
	let score = 0;
	for (let i = 0; i < TOTAL_LANES; i++) {
		score += calcLaneScore(i, player);
	}
	return score;
};

export function calcLaneScore(x: number, player: Player) {
	const dict: any = {};
	let score = 0;
	// https://stackoverflow.com/a/5668116
	for (var i = 0; i < player.board[x].length; ++i) {
		if (player.board[x][i] !== 0) {
			if (!dict[player.board[x][i]]) dict[player.board[x][i]] = 0;
			++dict[player.board[x][i]];
		}
	}
	for (const property in dict) {
		score += +property * dict[property] * dict[property];
	}
	return score;
};
