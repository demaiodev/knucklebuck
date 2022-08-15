<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	type GameState = {
		gameOver: boolean;
		playerOnesTurn: boolean;
		difficulty: number;
		rollingDice: boolean;
	};

	type Player = {
		name: string;
		isFirstPlayer: boolean;
		currentRoll: number;
		score: number;
		currency: number;
		wager: number;
		board: any;
		wins: number;
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

	function getDiceRoll() {
		return Math.floor(Math.random() * 6 + 1);
	}

	function handleDiceRoll() {
		playerOne.currentRoll = getDiceRoll();
		gameState.rollingDice = false;
	}

	function makeSelection(x: number) {
		for (let y = 0; y < playerOne.board[x].length; y++) {
			if (playerOne.board[x][y] === 0) {
				playerOne.board[x][y] = playerOne.currentRoll;
				if (isGameOver()) gameState.gameOver = true;
				else gameState.playerOnesTurn = false;
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
		playerOnesTurn: true, // is it always player ones turn in the beginning?
		difficulty: 0,
		rollingDice: true
	};

	// create players
	const playerOne = createPlayer('Player One', true);
	const playerTwo = createPlayer('Computer Guy', false);

	// player rolls the dice

	// player chooses where to place his dice roll

	// calculations for the column

	// check if game is over
</script>

<svelte:head>
	<title>KnuckleBuck</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="table">
	
	<div class="tableside">
		<button on:click={handleDiceRoll} type="button" class="btn btn-primary">Roll Dice</button>
		<div class="dice">{dieFaces[playerOne.currentRoll]}</div>
	</div>
	<div />
	<section class="board">
		{#each playerOne.board as lane, index (index)}
			<div
				on:click={() => makeSelection(index)}
				class={gameState.playerOnesTurn === true && gameState.rollingDice === false
					? 'lane__active'
					: 'lane'}
			>
				{#each lane as space}
					<div class="space"><div class="dice">{dieFaces[space]}</div></div>
				{/each}
			</div>
		{/each}
	</section>
</div>

<style lang="scss">
	.lane {
		&__active:hover {
			background-color: bisque;
		}
	}

	.board {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
		margin-top: 4rem;
	}
	.dice {
		font-size: 4rem;
		color: #222;
		padding-bottom: 0.8rem;
	}
	.space {
		display: flex;
		align-items: center;
		border: 2px solid #222;
		justify-content: center;
		height: 6rem;
		width: 5.5rem;
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
