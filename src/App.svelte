<script>
	let showResults = false
	let errorMessage = ''
	let isLoading = false
	let response = []
	let userJSON = ''

	const sendRequest = () => {
		// verify if JSON is valid
		try { 
			JSON.parse(userJSON)
		} catch (e) {
			console.log(e)
			errorMessage = String(e)
			return 
		}
		errorMessage = ''
		isLoading = true
		
		fetch('./server', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: userJSON
		})
		.then(response => response.json())
		.then(data => {
			isLoading = false
			response = data
		});
	}
	const formatJsonOutput = (text) => {
		return Object.entries(text).map(([key, value]) => `"${key}": "${value}",`)
	}
</script>

<div>
	<h1>Translation to JSON Converter</h1>
	<div class="siteGrid">
		<form>
			<label for="jsonInput">Input English JSON here:</label>
			<textarea bind:value={userJSON} name="jsonInput" placeholder="Insert JSON here"></textarea>
			{#if errorMessage !== ''}
				<div class="errorMessage">{errorMessage}</div>
			{/if}
			<button type="submit" on:click|preventDefault={sendRequest}>Translate & Convert</button>
		</form>
		<div>
			{#if isLoading}
				<div class="loadingMessage">Now loading... may take 15 seconds or more</div>
			{/if}
			{#if response.length > 0}
				{#each response as {langCode, langName, translations}, i }
					<div class="translatedItem">
						<div class="translatedItemTitle"><div class="langCode">{langCode}</div><div class="langName">{langName}</div></div>
						<div class="translatedItemJSON">
							{#each formatJsonOutput(translations) as item}
								<div class="itemLine">{item}</div>
							{/each}
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>

<style>
	label {
		padding: 8px 0;
	}
	textarea {
		display: block;
		width: 100%;
		height: 300px;
		border-radius: 5px;
	}
	button {
		border-radius: 5px;
	}
	.siteGrid {
		max-width: 1000px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: 10px;
	}
	.errorMessage {
		background-color: rgb(255, 56, 56);
		color: rgb(153, 0, 0);
		border-radius: 5px;
		border: 1px solid rgb(153, 0, 0);
		padding: 8px;
		margin-bottom: 5px;
	}
	.loadingMessage {
		padding: 8px 0;
	}
	.translatedItem {
		margin: 5px 0;
		padding: 5px;
		border-radius: 5px;
		background-color: rgb(241, 241, 241);
	}
	.translatedItemTitle {
		display: flex;
		align-items: flex-end;
	}
	.langCode {
		background-color: orange;
		width: 20px;
		height: 20px;
		font-weight: bold;
		font-size: 12px;
		text-transform: uppercase;
		color: white;
		border-radius: 3px;
		display: grid;
		place-items: center;
	}
	.langName {
		font-weight: bold;
		padding-left: 5px;
	}
	.translatedItemJSON {
		border-radius: 5px;
		padding: 5px;
		background-color: rgb(248, 248, 248);
		margin-top: 5px;
	}
	.itemLine {
		/* padding-left: 10px; */
	}
</style>