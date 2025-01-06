<script lang="ts">
	import type { TeamJSON } from '$lib/contest-types';
	import Image from '$lib/ui/Image.svelte';
	import Video from '$lib/ui/Video.svelte';

	export let data: {
		team: TeamJSON;
	};
</script>

<div class="w-full h-full bg-green-200 p-2">
	<Video ref={data.team.webcam} type="webcam"/>
</div>
