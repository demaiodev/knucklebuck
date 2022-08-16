<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import type { Player } from 'src/types/Player';
	import type { GameState } from 'src/types/GameState';
	import Board from '$lib/Board.svelte';

	function getDiceRoll() {
		return Math.floor(Math.random() * 6 + 1);
	}

	function handleDiceRoll() {
		if (playerOne.isActive) playerOne.currentRoll = getDiceRoll();
		else playerTwo.currentRoll = getDiceRoll();
		gameState.rollingDice = false;
	}

	function getActivePlayer() {
		if (playerOne.isActive) return playerOne;
		else return playerTwo;
	}

	function endTurn() {
		playerOne.isActive = !playerOne.isActive;
		playerTwo.isActive = !playerTwo.isActive;
		gameState.rollingDice = true;
	}

	function makeSelection({ index }: { index: number }) {
		const player = getActivePlayer();
		for (let y = 0; y < player.board[index].length; y++) {
			if (player.board[index][y] === 0) {
				player.board[index][y] = player.currentRoll;
				if (isGameOver()) gameState.gameOver = true;
				endTurn();
				return;
			}
		}
	}

	function checkPlayerBoard(player: Player) {
		for (let x = 0; x < player.board.length; x++) {
			for (let y = 0; y < player.board[x].length; y++) {
				if (player.board[x][y] === 0) return false;
			}
		}
		return true;
	}

	function isGameOver() {
		// temporary, need to calculate scores after either board has been filled to determine the TRUE WINNER!!!
		const p1Wins = checkPlayerBoard(playerOne);
		const p2Wins = checkPlayerBoard(playerTwo);
		if (p1Wins) gameState.winner = playerOne.name;
		if (p2Wins) gameState.winner = playerTwo.name;
		return p1Wins || p2Wins;
	}

	function createPlayer(name: string, isFirstPlayer: boolean): Player {
		return {
			name,
			isFirstPlayer,
			currentRoll: 0,
			score: 0,
			currency: 100,
			wager: 0,
			wins: 0,
			isActive: false,
			board: [
				[0, 0, 0],
				[0, 0, 0],
				[0, 0, 0]
			]
		};
	}

	// crate game instance
	const gameState: GameState = {
		gameOver: false,
		difficulty: 0,
		rollingDice: true
	};

	const dieFaces: any = {
		0: '',
		1: '\u2680',
		2: '\u2681',
		3: '\u2682',
		4: '\u2683',
		5: '\u2684',
		6: '\u2685'
	};

	// create players
	const playerOne = createPlayer('Player One', true);
	const playerTwo = createPlayer('Computer Guy', false);

	// player one starts
	playerOne.isActive = true;

	$: whosTurn = playerOne.isActive ? 'Player ones turn' : 'Player twos turn';

	// Basic Turn Order
	// player clicks button to rolls the dice.
	// we assign the rolled number to the players currentRoll, then set rollingDice to false.
	// player chooses where to place number.

	// after a column is selected (makeSelection), we:
	// 1.) calculate each columns sum -- todo
	// 2.) calculate the current player's score -- todo
	// 3.) check if the game is over

	// end current players turn, next player begins.
</script>

<svelte:head>
	<title>KnuckleBuck</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

{#if gameState.gameOver}
	Congrats, {gameState.winner}!
{/if}
<div class="table">
	<div class="tableside">
		PLAYER 2
		<button
			disabled={!playerTwo.isActive || !gameState.rollingDice || gameState.gameOver}
			on:click={handleDiceRoll}
			type="button"
			class="btn btn-primary">Roll Dice</button
		>
		<div class="dice">{dieFaces[playerTwo.currentRoll]}</div>
	</div>
	<Board player={playerTwo} {gameState} on:selection={({ detail }) => makeSelection(detail)} />

	<div>{whosTurn}</div>
	<div class="tableside">
		PLAYER 1
		<button
			disabled={!playerOne.isActive || !gameState.rollingDice || gameState.gameOver}
			on:click={handleDiceRoll}
			type="button"
			class="btn btn-primary">Roll Dice</button
		>
		<div class="dice">{dieFaces[playerOne.currentRoll]}</div>
	</div>
	<Board player={playerOne} {gameState} on:selection={({ detail }) => makeSelection(detail)} />
</div>

<style lang="scss">
	.dice {
		font-size: 4rem;
		color: #222;
		padding-bottom: 0.8rem;
	}
	.tableside {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 2rem;
		height: 100px;
		.dice {
			margin-left: 2rem;
		}
	}
</style>
