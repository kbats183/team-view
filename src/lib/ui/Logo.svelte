<script lang="ts">
	import type { FileReferenceJSON } from '$lib/contest-types';
	import { CONTEST_URL } from '$lib/hardcoded';
	import Image from './Image.svelte';

	export let url: string = CONTEST_URL + 'contests';
	export let ref: FileReferenceJSON[] | undefined;
	export let size: number = 8;
</script>

<Image {url} {ref} {size} />
