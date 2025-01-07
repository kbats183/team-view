<script lang="ts">
	import type { FileReferenceJSON } from '$lib/contest-types';
	import Banner from '$lib/ui/Banner.svelte';
	import Logo from '$lib/ui/Logo.svelte';
	import '../app.css';
	import '../tailwind.css';

	export let data: {
		name: string;
		logo: FileReferenceJSON[];
		banner: FileReferenceJSON[];
	};
</script>

<div class="w-screen h-screen overflow-hidden flex flex-col">
  <div class="flex flex-row gap-8 bg-gray-800 text-white p-4 items-center">
	<div class="w-12">
		<Logo ref={data.logo} />
	</div>
	
	<div class="text-2xl w-full"><a href="/">{data.name}</a></div>

	<div class="text-lg"><a href="/scoreboard">Scoreboard</a></div>
  </div>

  <div class="overflow-auto flex flex-col gap-2">
	<slot />

	<div class="self-center p-2">
		<Banner ref={data.banner} />
	</div>
  </div>
</div>