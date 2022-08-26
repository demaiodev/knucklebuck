<script lang="ts">
	import { onMount } from 'svelte';

	let matches: [] = [];
	onMount(async () => {
		matches = JSON.parse(localStorage.getItem('matches')!) || [];
	});
</script>

<section>
	<h1 class="my-4 pb-4">Match History</h1>
	{#if matches.length}
		{#each matches as match}
			<p>{match}</p>
		{/each}
	{:else}
		<p class="text-center">
			There is no match history for you yet! <br /> Go play <a href="/">here</a>.
		</p>
	{/if}
</section>
