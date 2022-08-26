<script lang="ts">
	import { onMount } from 'svelte';

	let matches: any[] = [];

	onMount(async () => {
		matches = JSON.parse(localStorage.getItem('matches')!) || [];
	});

	function getGameStatus(p1score: number, p2score: number) {
		if (p1score > p2score) return 'You won this one!';
		else if (p1score === p2score) return 'You tied this one somehow. Cool!';
		else return 'You lost this one.';
	}
</script>

<section>
	<h1 class="my-4 pb-4">Match History</h1>
	{#if matches.length}
		{#each matches as match, index (index)}
			<div class="container border p-3">
				<h3 class="pb-3">Game #{index + 1}</h3>
				<p>{match.playerOne.name}: <span class="p1">{match.playerOne.score}</span></p>
				<p>{match.playerTwo.name}: <span class="p2">{match.playerTwo.score}</span></p>
				<p>{getGameStatus(match.playerOne.score, match.playerTwo.score)}</p>
			</div>
		{/each}
	{:else}
		<p class="text-center">
			There is no match history for you yet! <br /> Go play <a href="/">here</a>.
		</p>
	{/if}
</section>

<style lang="scss">
	.p1 {
		color: var(--accent-color);
	}
	.p2 {
		color: var(--accent-color-secondary);
	}
</style>
