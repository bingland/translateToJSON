# translateToJSON
Translate a JSON object into different languages

## Running the app

Install the dependencies:

```bash
npm install
```

Create an optimised version of the Svelte frontend:

```bash
npm run build
```

Run the Express server:

```bash
node index.js
```

## Running the app while developing

This does need to be worked on a bit more you can can the Express server and Svelte in live refresh mode if you run to processes in two different windows.

First terminal for running Svelte:

```bash
npm run start
```

Seconds terminal for running Express:

```bash
node index.js
```
