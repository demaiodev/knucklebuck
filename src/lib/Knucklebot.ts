import type { Player } from 'src/types/Player';
import type { GameState } from 'src/types/GameState';

export function knucklebotMove(player: Player, self: Player, game: GameState) {
	const match = matchMove(self);
	const capture = captureMove(player, self);

	if (capture != -1 && !laneIsFull(self, capture)) return capture;
	if (match != -1 && !laneIsFull(self, match)) return match;
	else return randomMove(self, game);
}

const randomMove = (self: Player, game: GameState) => {
	let randomMove = selectRandomSpace();
	while (laneIsFull(self, randomMove) && !game.gameOver) randomMove = selectRandomSpace();

	return randomMove;
};

const matchMove = (self: Player) => {
	for (let x = 0; x < self.board.length; x++) {
		const match = self.board[x].find((value: number) => value === self.currentRoll);
		if (match) return x;
	}
	return -1;
};

const captureMove = (player: Player, self: Player) => {
	for (let x = 0; x < player.board.length; x++) {
		const capture = player.board[x].find((value: number) => value === self.currentRoll);
		if (capture) return x;
	}
	return -1;
};

const laneIsFull = (self: Player, x: number) => {
	const lastRow = 2;
	if (self.board[x][lastRow] !== 0) return true;
	else return false;
};

const selectRandomSpace = () => {
	return Math.floor(Math.random() * 3);
};
