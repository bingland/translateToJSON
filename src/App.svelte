<script>
	let errorMessage = ''
	let isLoading = false
	let response = []
	let userJSON = ''
	let customSelector = ''
	let serverErrorMessage = ''

	const sendRequest = () => {
		try { // verify if JSON is valid
			JSON.parse(userJSON)
		} catch (e) {
			errorMessage = String(e)
			return 
		}
		serverErrorMessage = ''
		errorMessage = ''
		isLoading = true
		
		fetch('./server', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				userJSON: JSON.parse(userJSON), 
				customSelector
			})
		})
		.then(response => response.json())
		.then(data => {
			isLoading = false
			response = data
		})
		.catch((e) => {
			isLoading = false
			response = []
			serverErrorMessage = String(e)
		})
	}
	const copyText = (e) => {
		let selectionText = e.target.parentElement.parentElement.lastElementChild.innerText
		navigator.clipboard.writeText(selectionText)
		e.target.innerText = 'Copied!'
		setTimeout(() => {
			e.target.innerText = 'Copy'
		}, 1300);
	}
	const formatJsonOutput = (text) => {
		return Object.entries(text).map(([key, value]) => `"${key}": "${value}",`)
	}
</script>

<div class="wrapper">
	<h1>Translation to JSON Converter</h1>
	<div class="siteGrid">
		<form>
			<div class="jsonInputArea">
				<label for="jsonInput">Input English JSON here:</label>
				<textarea bind:value={userJSON} name="jsonInput" placeholder="Insert JSON here"></textarea>
				<label for="customSelector">Custom selector name</label>
				<input bind:value={customSelector} class="customSelector" name="customSelector" placeholder="Default is .VIiyi" />
			</div>
			{#if errorMessage !== ''}
				<div class="errorMessage">{errorMessage}</div>
			{/if}
			<button type="submit" on:click|preventDefault={sendRequest}>Translate & Convert</button>
		</form>
		<div>
			{#if isLoading}
				<div class="loadingMessage">Now loading... May take up to 15 seconds to finish.</div>
			{/if}
			{#if serverErrorMessage !== ''}
				<div class="serverErrorMessage">Server error. Chances are, the selector name didn't find any elements. Try a new selector name and see what happens 🐸</div>
			{/if}
			{#if response.length > 0 && !isLoading}
				{#each response as {langCode, langName, translations}, i }
					<div class="translatedItem">
						<div class="translatedItemTitle">
							<div class="translatedItemLeft">
								<div class="langCode">{langCode}</div>
								<div class="langName">{langName}</div>
							</div>
							<div class="copyButton" on:click={copyText}>Copy</div>
						</div>
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
	.wrapper {
		padding: 0 5px;
	}
	label {
		padding-bottom: 8px;
		font-weight: bold;
	}
	textarea {
		display: block;
		width: 100%;
		height: 300px;
		border-radius: 5px;
		margin-bottom: 5px; 
		resize: vertical;
	}
	input {
		border-radius: 5px;
		width: 100%;
	}
	textarea:focus, input:focus {
		outline: none;
	}
	button {
		border-radius: 5px;
		border: 1px solid rgb(168, 168, 168);
		margin: 5px 0;
	}
	.siteGrid {
		display: grid;
		grid-template-columns: 450px 1fr;
		grid-gap: 10px;
	}
	.jsonInputArea {
		margin: 5px 0 10px 0;
		padding: 8px;
		border-radius: 5px;
		background-color: rgb(226, 226, 226);

		border: 1px solid rgb(168, 168, 168);
	}
	.errorMessage, .serverErrorMessage {
		background-color: rgb(255, 56, 56);
		color: rgb(153, 0, 0);
		border-radius: 5px;
		border: 1px solid rgb(153, 0, 0);
		padding: 8px;
		margin-bottom: 5px;
	}
	.serverErrorMessage {
		margin: 5px auto;
		text-align: center;
		max-width: 465px;
	}
	.loadingMessage {
		padding: 8px 0;
		text-align: center;
	}
	.translatedItem {
		margin: 5px 0 10px 0;
		padding: 5px;
		border-radius: 5px;
		background-color: rgb(226, 226, 226);
		border: 1px solid rgb(168, 168, 168);
	}
	.translatedItemTitle {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		position: relative;
		padding: 1px 0;
	}
	.translatedItemLeft {
		display: flex;
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
		position: relative;
	}
	.itemLine {
		/* padding-left: 10px; */
	}
	.copyButton {
		padding: 3px;
		border-radius: 3px;
		background-color: rgb(87, 87, 87);
		color: white;
		position: absolute;
		width: 50px;
		right: 5px;
		top: 5px;
		display: grid;
		place-items: center;
		cursor: pointer;
		font-size: 12px;
		top: 0;
	}
</style>
