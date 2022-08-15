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

	function getDiceRoll() {
		return Math.floor(Math.random() * 6 + 1);
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
		rollingDice: false
	};

	// create players
	const playerOne = createPlayer('Player One', true);
	const playerTwo = createPlayer('Computer Guy', false);

	// player rolls the dice
	playerOne.currentRoll = getDiceRoll();

	// player chooses where to place his dice roll

	// calculations for the column

	// check if game is over

</script>

<svelte:head>
	<title>KnuckleBuck</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
