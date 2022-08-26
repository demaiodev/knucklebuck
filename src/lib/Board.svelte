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

	$: laneActive =
		!gameState.rollingDice && !waitingForTurn && player.isFirstPlayer ? ' active' : '';
	$: waitingForTurn = !player.isActive;
</script>

<section class="board">
	{#each player.board as lane, index (index)}
		{#if player.isFirstPlayer}
			<div class="score-wrapper">
				<h3 class="fp_lane_score">{calcLaneScore(index, player)}</h3>
			</div>
		{/if}
		<button
			disabled={waitingForTurn ||
				gameState.rollingDice ||
				gameState.gameOver ||
				!player.isFirstPlayer}
			class={laneType + laneActive}
			on:click={() => emitSelection(index)}
		>
			{#each lane as space}
				<div class="space"><div class="dice">{dieFaces[space]}</div></div>
			{/each}
		</button>
		{#if !player.isFirstPlayer}
			<div class="score-wrapper">
				<h3 class="sp_lane_score">{calcLaneScore(index, player)}</h3>
			</div>
		{/if}
	{/each}
</section>

<style lang="scss">
	.score-wrapper {
		position: relative;
	}
	button {
		background: transparent;
		&:disabled {
			background: transparent;
		}
	}
	.fp_lane_score {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 2rem;
		top: -185px;
		left: 33px;
		position: absolute;
		color: var(--accent-color);
	}
	.sp_lane_score {
		top: 150px;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 2rem;
		left: -60px;
		position: absolute;
		color: var(--accent-color-secondary);
	}
	.lane {
		display: flex;
		flex-direction: column;
		border: 1px solid transparent;
		margin: 0;
		padding: 0;
	}

	.active:hover {
		border: 1px solid var(--accent-color);
		background-color: rgba(244, 192, 37, 0.15);
	}
	.lane--inverted {
		display: flex;
		flex-direction: column-reverse;
		border: 1px solid transparent;
		padding: 0;
		margin: 0;
	}
	.dice {
		font-size: 4rem;
		color: var(--secondary-color);
		padding-bottom: 0.8rem;
	}
	.board {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
	}
	.space {
		display: flex;
		align-items: center;
		border: 2px solid var(--secondary-color);
		justify-content: center;
		height: 6rem;
		width: 5.5rem;
		margin: 0.1rem 0.07rem;
	}
</style>
