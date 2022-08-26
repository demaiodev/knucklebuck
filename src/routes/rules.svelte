<section class="text-center">
	<h1 class="my-4 pb-4">How To Play</h1>
	<h5>Your score is calculated by adding all of your dice together.</h5>
	<div class="parent container my-3">
		<div class="my-4 pt-4">
			<h3>Match Dice</h3>
			<p>When dice of the same number are placed in the same column, multiply their value.</p>
		</div>
		<div class="my-4 pt-4">
			<h3>Destroy Opponent</h3>
			<p>Destroy your opponent's dice by matching yours to theirs.</p>
		</div>
	</div>
</section>

<style lang="scss">
	.parent {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(2, 1fr);
		@media only screen and (max-width: 768px) {
			display: grid;
			grid-template-columns: 1fr;
			margin: 0;
			grid-template-rows: 1fr;
		}
	}
</style>
