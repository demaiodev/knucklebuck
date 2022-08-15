export type Player = {
    name: string;
    isFirstPlayer: boolean;
    currentRoll: number;
    score: number;
    currency: number;
    wager: number;
    board: any;
    wins: number;
    isActive: boolean;
};