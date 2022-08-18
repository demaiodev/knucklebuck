<script lang="ts">
	import type { Player } from 'src/types/Player';
	import type { GameState } from 'src/types/GameState';
	import { calcLaneScore } from './utils/scores';
	import { dieFaces } from './utils/constants';
	import { createEventDispatcher } from 'svelte';

	export let gameState: GameState;
	export let player: Player;

	const laneType = !player.isFirstPlayer ? 'lane--inverted' : 'lane';
	const dispatch = createEventDispatcher();

	function emitSelection(index: number) {
		dispatch('selection', { index });
	}

	$: laneActive = !gameState.rollingDice && !waitingForTurn ? ' active' : '';
	$: waitingForTurn = !player.isActive;
</script>

<section class="board">
	{#each player.board as lane, index (index)}
		<div class="score-wrapper">
			<div class="lane_score">{calcLaneScore(index, player)}</div>
		</div>
		<button
			disabled={waitingForTurn || gameState.rollingDice || gameState.gameOver}
			class={laneType + laneActive}
			on:click={() => emitSelection(index)}
		>
			{#each lane as space}
				<div class="space"><div class="dice">{dieFaces[space]}</div></div>
			{/each}
		</button>
	{/each}
</section>

<style lang="scss">
	.score-wrapper {
		position: relative;
	}
	.lane_score {
		top: -185px;
		left: 30px;
		position: absolute;
	}
	.active:hover {
		background-color: bisque;
	}
	.lane {
		border: none;
		padding: 0;
		margin: 0;
	}
	.lane--inverted {
		display: flex;
		flex-direction: column-reverse;
		border: none;
		padding: 0;
		margin: 0;
	}
	.dice {
		font-size: 4rem;
		color: #222;
		padding-bottom: 0.8rem;
	}
	.board {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
		// margin-top: 4rem;
	}
	.space {
		display: flex;
		align-items: center;
		border: 2px solid #222;
		justify-content: center;
		height: 6rem;
		width: 5.5rem;
	}
</style>
