import type { Player } from 'src/types/Player';

export function knucklebotMove(player: Player, self: Player ){
    console.log(self.currentRoll)
    const move = Math.floor(Math.random() * 2 + 1)
    console.log(move)
    return move
}