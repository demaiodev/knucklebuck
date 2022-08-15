<script lang="ts">
	import type { Player } from 'src/types/Player';
	import type { GameState } from 'src/types/GameState';

	export let gameState: GameState;
	export let player: Player;

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function emitSelection(index: number) {
		dispatch('selection', { index, player });
	}

	const dieFaces: any = {
		0: '',
		1: '\u2680',
		2: '\u2681',
		3: '\u2682',
		4: '\u2683',
		5: '\u2684',
		6: '\u2685'
	};
</script>

<section class="board">
	{#each player.board as lane, index (index)}
		<div
			on:click={() => emitSelection(index)}
			class={gameState.rollingDice === false ? 'lane__active' : 'lane'}
		>
			{#each lane as space}
				<div class="space"><div class="dice">{dieFaces[space]}</div></div>
			{/each}
		</div>
	{/each}
</section>

<style lang="scss">
	.lane {
		&__active:hover {
			background-color: bisque;
		}
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
		margin-top: 4rem;
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
