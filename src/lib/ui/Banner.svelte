<script lang="ts">
	import type { FileReferenceJSON } from '$lib/contest-types';
	import { CONTEST_URL } from '$lib/hardcoded';
	import Image from './Image.svelte';

	export let url: string = CONTEST_URL + 'contests';
	export let ref: FileReferenceJSON[] | undefined;
	export let size: 16 | 24 | 32 | 64 = 16;
</script>

<div class="max-h-{size} h-{size} flex place-content-center">
  <Image {url} {ref} {size} />
</div>
