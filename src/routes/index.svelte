<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import type { Player } from 'src/types/Player';
	import type { GameState } from 'src/types/GameState';
	import { calcTotalScore } from '$lib/utils/scores';
	import { dieFaces } from '$lib/utils/constants';
	import { knucklebotMove } from '$lib/Knucklebot';

	import Board from '$lib/Board.svelte';

	let playerOneName = 'Player 1';
	let playerOne: Player;
	let playerTwo: Player;
	let gameState: GameState;

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
		playerOne.score = calcTotalScore(playerOne);
		playerTwo.score = calcTotalScore(playerTwo);
		if (isGameOver()) gameState.gameOver = true;
		playerOne.isActive = !playerOne.isActive;
		playerTwo.isActive = !playerTwo.isActive;
		playerOne.currentRoll = 0;
		playerTwo.currentRoll = 0;
		gameState.rollingDice = true;
		handleDiceRoll();

		if (playerTwo.isActive) initKnucklebotMove();
	}

	function initKnucklebotMove() {
		const selection = { index: knucklebotMove(playerOne, playerTwo, gameState) };
		setTimeout(() => {
			makeSelection(selection);
		}, 1500);
	}

	function makeSelection({ index }: { index: number }) {
		const player = getActivePlayer();
		const otherPlayerBoard = player.isFirstPlayer ? playerTwo.board : playerOne.board;
		for (let y = 0; y < player.board[index].length; y++) {
			if (player.board[index][y] === 0) {
				player.board[index][y] = player.currentRoll;
				clearMatches(otherPlayerBoard[index], player.currentRoll);
				endTurn();
				return;
			}
		}
	}

	function clearMatches(arr: number[], value: number) {
		var i = 0;
		while (i < arr.length) {
			if (arr[i] === value) {
				arr.splice(i, 1);
				arr.push(0);
			} else {
				++i;
			}
		}
		return arr;
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
		// we need to add a list of defeat messages that the AI will spout out if they lose
		const p1BoardFull = checkPlayerBoard(playerOne);
		const p2BoardFull = checkPlayerBoard(playerTwo);
		// not clear if this is the actual win condition, but maybe.
		if (p1BoardFull || p2BoardFull) {
			if (playerOne.score > playerTwo.score) {
				gameState.winner = playerOne;
				gameState.gameOver = true;
				playerOne.wins++;
				saveData();
				return true;
			}
			if (playerTwo.score > playerOne.score) {
				gameState.winner = playerTwo;
				gameState.gameOver = true;
				playerTwo.wins++;
				saveData();
				return true;
			}
		}
		return false;
	}

	function saveData() {
		let array = JSON.parse(localStorage.getItem('matches')!) || [];
		array.push({ playerOne, playerTwo });
		localStorage.setItem('matches', JSON.stringify(array));
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

	function startGame(init: boolean) {
		gameState = {
			gameOver: init,
			difficulty: 0,
			rollingDice: true
		};
		playerOne = createPlayer(playerOneName, true);
		playerTwo = createPlayer('Computer Guy', false);
		playerOne.isActive = true;
		handleDiceRoll();
	}

	startGame(true);
</script>

<svelte:head>
	<title>Knucklebuck</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

{#if gameState.gameOver}
	{#if !gameState.winner}
		<div class="d-flex flex-column container w-50">
			<h1 class="d-flex justify-content-center my-4">Welcome to Knucklebuck</h1>
			<h6 class="position-absolute" style="right:100px;">
				<a href="/rules">How do I play?</a>
			</h6>
			<h5 class="d-flex justify-content-center my-4">Enter your name here:</h5>
			<input class="form-control mb-4" type="text" bind:value={playerOneName} />
			<button
				type="button"
				class="btn btn-danger p-2 my-2"
				disabled={!playerOneName}
				on:click={() => {
					playerOne.name = playerOneName;
					gameState.gameOver = false;
				}}>Start Game!</button
			>
		</div>
	{:else}
		<div class="d-flex flex-column container w-50">
			<h1 class="d-flex justify-content-center my-4">
				Congrats, {gameState.winner?.name}! <br /> You scored {gameState.winner?.score} points.
			</h1>
			<button type="button" class="btn btn-danger my-4" on:click={() => startGame(false)}
				>Try Again?</button
			>
		</div>
	{/if}
{:else}
	<!-- start match game -->

	<div class="enemy">
		<div />
		<div class="enemy__board">
			<Board player={playerTwo} {gameState} on:selection={({ detail }) => makeSelection(detail)} />
		</div>
		<div class="enemy__stats">
			<div class="h3">
				<span class={playerTwo.isActive ? 'enemy__stats--active' : ''}>
					{playerTwo.name}:
				</span><span class="px-2 enemy__stats__score">
					{playerTwo.score}
				</span>
			</div>
			<div class="dice">{dieFaces[playerTwo.currentRoll]}</div>
		</div>
	</div>

	<hr class="divider m-0" />

	<div class="player">
		<div class="player__stats">
			<div class="h3">
				<span class={playerOne.isActive ? 'player__stats--active' : ''}>
					{playerOne.name}:
				</span><span class="px-2 player__stats__score">
					{playerOne.score}
				</span>
			</div>
			<div class="dice">{dieFaces[playerOne.currentRoll]}</div>
		</div>
		<div class="player__board">
			<Board player={playerOne} {gameState} on:selection={({ detail }) => makeSelection(detail)} />
		</div>
		<div />
	</div>
{/if}

<style lang="scss">
	.player,
	.enemy {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		margin: 3rem 0;
		@media only screen and (max-width: 768px) {
			display: grid;
			grid-template-columns: 1fr;
			margin: 0;
		}
		&__stats {
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-direction: column;
			height: 115px;
			@media only screen and (max-width: 768px) {
				flex-direction: row;
				justify-content: center;
			}
		}
	}
	.enemy__stats {
		&__score {
			color: var(--accent-color-secondary);
		}
		&--active {
			text-decoration: underline var(--accent-color-secondary);
		}
	}
	.player__stats {
		&__score {
			color: var(--accent-color);
		}
		&--active {
			text-decoration: underline var(--accent-color);
		}
	}
	.divider {
		color: var(--secondary-color);
	}
	.dice {
		font-size: 4rem;
		padding: 0px;
		margin: 0px;
		color: var(--secondary-color);
		padding-bottom: 1.15rem;
		padding-top: 0;
	}
</style>
