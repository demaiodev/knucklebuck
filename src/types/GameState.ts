import type { Player } from "./Player";

export type GameState = {
    winner?: Player;
    gameOver: boolean;
    difficulty: number;
    rollingDice: boolean;
};