export {};

const retrievePlayerShadowRoot = () =>
	document
		.querySelector('app-root')
		?.shadowRoot?.querySelector('app-header')
		?.shadowRoot?.querySelector('echo-player')?.shadowRoot;

Connector.getArtist = () => {
	const player = retrievePlayerShadowRoot();
	const artistElement = player?.querySelector('#artist-name');
	const content = artistElement?.textContent;

	return content;
};

Connector.getTrack = () => {
	const player = retrievePlayerShadowRoot();
	const trackElement = player?.querySelector('#track-name');
	const content = trackElement?.textContent;

	return content;
};

Connector.getTrackArt = () => {
	const player = retrievePlayerShadowRoot();
	const trackCover = player?.querySelector('#track-cover');
	const src = trackCover?.attributes?.getNamedItem('src')?.textContent;

	return src;
};

Connector.isPlaying = () => {
	const player = retrievePlayerShadowRoot();
	const pauseButton = player?.querySelector('#pause');

	console.log('Pause button content', pauseButton);

	return !!pauseButton;
};

const observePlayerForChanges = (player: ShadowRoot) => {
	console.log("Player's children changed, setting up player state observer");

	const observer = new MutationObserver(() => {
		Connector.onStateChanged();
	});
	const target = player.getElementById('player');
	if (!target) {
		console.error('No player found, ignoring observer');
		return;
	}

	observer.observe(target, {
		attributes: true,
	});
	console.log('Finished setting up player state observer');
};

const startObserving = (player: ShadowRoot) => {
	const observer = new MutationObserver(() => {
		// Trigger an initial state change event.
		Connector.onStateChanged();

		// And set up an observer for changes in the player's dataset.
		observePlayerForChanges(player);
	});
	const target = player.querySelector('.player');
	if (!target) {
		console.error(
			'Somehow there was no play button, something must have changed!',
		);
		return;
	}

	observer.observe(target, {
		childList: true,
		subtree: true,
	});
	console.log('Finished setting up observer');
};

// Wait until the player is loaded and start observing.
const timer = setInterval(() => {
	const player = retrievePlayerShadowRoot();

	if (player) {
		console.log('Player loaded, setting up observer');
		startObserving(player);
		clearInterval(timer);
	}
}, 2000);
