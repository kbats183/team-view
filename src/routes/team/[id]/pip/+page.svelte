<script lang="ts">
	import Video from '$lib/ui/Video.svelte';

	let { data } = $props();
</script>

<div class="flex flex-row relative">
	<div class="w-full h-full bg-green-700 p-2">
		<Video ref={data.team.desktop} type="desktop"/>

		<div class="w-84 h-56 bg-green-200 p-2 absolute top-8 right-0">
			<Video ref={data.team.webcam} type="webcam"/>
		</div>
	</div>

	<div class="w-24"></div>
</div>
