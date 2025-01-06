<script lang="ts">
	import type { TeamJSON } from '$lib/contest-types';
	import Video from '$lib/ui/Video.svelte';

	export let data: {
		team: TeamJSON;
	};
</script>

<div class="w-full h-full bg-green-700 p-2">
	<Video ref={data.team.desktop} type="desktop"/>
</div>
