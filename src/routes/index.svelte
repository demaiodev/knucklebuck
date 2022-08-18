<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import type { Player } from 'src/types/Player';
	import type { GameState } from 'src/types/GameState';
	import { calcTotalScore } from '$lib/utils/scores';
	import { dieFaces } from '$lib/utils/constants';

	import Board from '$lib/Board.svelte';

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
	}

	function makeSelection({ index }: { index: number }) {
		const player = getActivePlayer();
		const otherPlayerBoard = player.isFirstPlayer ? playerTwo.board : playerOne.board;
		for (let y = 0; y < player.board[index].length; y++) {
			if (player.board[index][y] === 0) {
				player.board[index][y] = player.currentRoll;
				clearMatches(otherPlayerBoard[index], player.currentRoll);
				isGameOver();
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
				return true;
			}
			if (playerTwo.score > playerOne.score) {
				gameState.winner = playerTwo;
				gameState.gameOver = true;
				return true;
			}
		}
		return false;
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
		playerOne = createPlayer('Player One', true);
		playerTwo = createPlayer('Computer Guy', false);
		playerOne.isActive = true;
		handleDiceRoll();
	}

	startGame(true);

	$: whosTurn = playerOne.isActive ? 'Player ones turn' : 'Player twos turn';
</script>

<svelte:head>
	<title>Knucklebuck</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

{#if gameState.gameOver}
	{#if !gameState.winner}
		<div class="d-flex flex-column">
			<h1 class="d-flex justify-content-center my-4">Welcome to Knucklebuck</h1>
			<h2 class="d-flex justify-content-center my-4">
				👇 Click this here button to get started 👇
			</h2>
			<button
				type="button"
				class="btn btn-primary p-2 my-4"
				on:click={() => (gameState.gameOver = false)}>Start Game!</button
			>
		</div>
	{:else}
		<div class="d-flex flex-column">
			<h1 class="d-flex justify-content-center my-4">
				Congrats, {gameState.winner?.name}! Winner with {gameState.winner?.score} points!
			</h1>
			<button type="button" class="btn btn-primary my-4" on:click={() => startGame(false)}
				>Try Again?</button
			>
		</div>
	{/if}
{:else}
	<div class="table">
		<div class="tableside">
			<div class={playerTwo.isActive ? 'active-player' : ''}>
				{playerTwo.name}
				{playerTwo.score}
			</div>
			<div class="dice">{dieFaces[playerTwo.currentRoll]}</div>
		</div>
		<Board player={playerTwo} {gameState} on:selection={({ detail }) => makeSelection(detail)} />
		<div>{whosTurn}</div>
		<div class="tableside">
			<div class={playerOne.isActive ? 'active-player' : ''}>
				{playerOne.name}
				{playerOne.score}
			</div>
			<div class="dice">{dieFaces[playerOne.currentRoll]}</div>
		</div>
		<Board player={playerOne} {gameState} on:selection={({ detail }) => makeSelection(detail)} />
	</div>
{/if}

<style lang="scss">
	.active-player {
		font-size: 1.5rem;
		color: red; // what color should this be?
	}
	.dice {
		font-size: 4rem;
		color: #222;
		padding-bottom: 0.8rem;
	}
	.tableside {
		display: flex;
		justify-content: center;
		align-items: center;
		// margin-top: 2rem;
		height: 100px;
		.dice {
			margin-left: 2rem;
		}
	}
</style>
