<script lang="ts">
	import type { FileReferenceJSON } from '$lib/contest-types';
	import { CONTEST_URL } from '$lib/hardcoded';
	import { ContestUtil } from '../contest-util';

	export let url: string = CONTEST_URL + 'contests';
	export let ref: FileReferenceJSON[] | undefined;
	export let size: number;

	const util = new ContestUtil();
	const bestRef = util.bestSquareLogo(ref, size * 20);
	const imgSrc = url.substring(0, CONTEST_URL.length) + bestRef?.href;
</script>

{#if bestRef}
  <img src={imgSrc} alt="logo" class="w-full h-full object-scale-down rounded-md" />
{/if}
