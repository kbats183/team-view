<script lang="ts">
	import Video from '$lib/ui/Video.svelte';

	let { data } = $props();
</script>

<div class="w-full h-full bg-green-200 p-2">
	<Video ref={data.team.webcam} type="webcam"/>
</div>
