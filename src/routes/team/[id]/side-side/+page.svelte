<script lang="ts">
	import Video from '$lib/ui/Video.svelte';

	let { data } = $props();
</script>

<div class="flex w-full h-full gap-2">
  <!-- каждая колонка делит ширину пополам -->
  <div class="w-1/2 flex-1">
    <!-- wrapper обеспечивает аспект 16:9 -->
    <div class="w-full h-full aspect-video">
      <Video ref={data.team.desktop?.[0]} type="desktop" />
    </div>
  </div>

  <div class="w-1/2 flex-1">
    <div class="w-full h-full aspect-video">
      <Video ref={data.team.webcam?.[0]} type="webcam" />
    </div>
  </div>
</div>