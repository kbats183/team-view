<script lang="ts">
	import type { FileReference } from '$lib/contest-types';

	import { onMount, onDestroy } from 'svelte';
	import videojs from 'video.js';
	import type Player from 'video.js/dist/types/player';
	import 'video.js/dist/video-js.css'; // default Video.js CSS

	interface Props {
		ref?: FileReference;
		type: string;
	}

	let { ref, type }: Props = $props();

	let src = $derived(ref ? ref.href : undefined);
	let mime = $derived(ref ? ref.mime : undefined);

	let videoNode = $state<HTMLElement | string>('');
	let player = $state<Player>();
	let client: any;

	const options = {
		autoplay: true,
		controls: false,
		responsive: true,
		fluid: false,
		poster: '/images/icpc-logo.png',
		preload: 'auto',
		mpegtsjs: {
			mediaDataSource: {
				isLive: true,
				cors: true,
				withCredentials: false
			}
		}
	};

	onMount(async () => {
		if (!src) {
			return
		}
		if (mime !== 'application/vnd.webrtc-grabber.stream') {
			await import('videojs-mpegtsjs');

			player = videojs(videoNode, options, function onPlayerReady() {
				// player ready
			});
			if (src) {
				if (mime === 'video/m2ts') {
					// Video.js mpegts.js expects a different mime type
					mime = 'video/mp2t';
				}
				let srcObj = {
					src: src,
					type: mime
				};
				player.src(srcObj);
			}
		} else {
			const url = new URL(src);
			const peerName = url.searchParams.get('peerName');
			const streamType = url.searchParams.get('streamType');
			const credential = url.searchParams.get('credential');
			const baseUrl = `${url.protocol}//${url.host}`;

			const { GrabberPlayerClient } = await import('$lib/grabber/GrabberPlayerClient'); // потом заменим путь

			client = new GrabberPlayerClient('play', baseUrl);

			client.authorize(credential);
			client.on('initialized', () => {
				client.connect({ peerName }, streamType, (stream) => {
					console.log('Got WebRTC stream', stream);
					if (videoNode && stream instanceof MediaStream) {
						const el = videoNode as HTMLVideoElement;
						el.srcObject = stream;
						el.play();
						el.style.width = "100%";
						el.style.height = "100%";
						el.style.objectFit = "contain";
					}
				});
			});
		}
	});

	onDestroy(() => {
		if (player) {
			player.dispose();
		}
		if (client) {
			client.close();
		}
	});
</script>

{#if src}
	<!-- svelte-ignore a11y_media_has_caption -->
	<video bind:this={videoNode} class="video-js vjs-default-skin w-full h-full"></video>
{:else}
	<span class="self-center">({type} unavailable)</span>
{/if}
