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
		// player clicks button to rolls the dice.
		// we assign the rolled number to the players currentRoll, then set rollingDice to false.
		// player chooses where to place number.
		getActivePlayer().currentRoll = getDiceRoll();
		console.log({playerOne, playerTwo})
		gameState.rollingDice = false;
	}

	function getActivePlayer() {
		if (playerOne.isActive) return playerOne
		else return playerTwo
	}

	function endTurn() {
		playerOne.isActive = !playerOne.isActive;
		playerTwo.isActive = !playerTwo.isActive;
	}

	function makeSelection({ index }: { index: number }) {
		// 1.) calculate each columns sum -- todo
		// 2.) calculate the current player's score -- todo
		// 3.) check if the game is over
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

	function isGameOver() {
		for (let x = 0; x < playerOne.board.length; x++) {
			for (let y = 0; y < playerOne.board[x].length; y++) {
				if (playerOne.board[x][y] === 0) return false;
			}
		}
		return true;
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

<div class="table">
	{
		`Is it ${getActivePlayer().name}'s turn? ${getActivePlayer().isActive}`
	}
	<!-- Player Ones Board and Button -->
	<div class="tableside">
		<button on:click={handleDiceRoll} type="button" class="btn btn-primary">Roll Dice</button>
		<div class="dice">{playerOne.currentRoll}</div>
	</div>
	<Board player={playerOne} {gameState} on:selection={({ detail }) => makeSelection(detail)} />

	<!-- Player Twos Board and Button -->
	<div class="tableside">
		<button on:click={handleDiceRoll} type="button" class="btn btn-primary">Roll Dice</button>
		<div class="dice">{dieFaces[playerTwo.currentRoll]}</div>
	</div>
	<Board player={playerTwo} {gameState} on:selection={({ detail }) => makeSelection(detail)} />
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
