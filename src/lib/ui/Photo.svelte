<script lang="ts">
	import type { FileReferenceJSON } from '$lib/contest-types';
	import { CONTEST_URL } from '$lib/hardcoded';
	import Image from './Image.svelte';

	export let url: string = CONTEST_URL + 'contests';
	export let ref: FileReferenceJSON[] | undefined;
	let size = 24;
</script>

<div class="max-h-{size} max-w-{size} h-{size} w-{size} flex place-content-center">
  <Image {url} {ref} size={size} />
</div>
