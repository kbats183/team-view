<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import JudgementType from '$lib/ui/JudgementType.svelte';
	import Person from '$lib/ui/Person.svelte';
	import Photo from '$lib/ui/Photo.svelte';
	import Problem from '$lib/ui/Problem.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();

	onMount(() => {
		const interval = setInterval(() => {
			invalidate('data:team');
		}, 3000);

		return () => {
			clearInterval(interval);
		};
	});

	let showSource = $state(false);
	let sourceUrl = $state<string | null>(null);
	let sourceTitle = $state<string | null>(null);
	function openSource(url: string, title: string) {
		console.log('open');
		sourceUrl = url;
		sourceTitle = title;
		showSource = true;
	}

	function closeSource() {
		showSource = false;
		sourceUrl = null;
	}

</script>

<div class="flex flex-col p-2 gap-1 h-full overflow-auto bg-white">
	<div class="flex flex-col">
		<div class="text-xl">Name</div>
		<div>{data.team.name}</div>
	</div>

	{#if data.organization}
		<div class="flex flex-col">
			<div class="text-xl">Organization</div>
			<div>{data.organization.formal_name || data.organization.name}</div>
		</div>
	{/if}

	{#if data.organization?.country}
		<div class="flex flex-col">
			<div class="text-xl">Country</div>
			<div>{data.country}</div>
		</div>
	{/if}

	{#if data.organization?.url}
		<div class="flex flex-col">
			<div class="text-xl">Website</div>
			<div>{data.organization.url}</div>
		</div>
	{/if}

	{#if data.organization?.twitter_hashtag}
		<div class="flex flex-col">
			<div class="text-xl">Hashtag</div>
			<div>{data.organization.twitter_hashtag}</div>
		</div>
	{/if}

	{#if data.groups && data.groups.length > 0}
		<div class="flex flex-col">
			<div class="text-xl">Groups</div>
			<div class="flex flex-row gap-2">
				{#each data.groups as group}
					<div>{group.name}</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if data.submissions && data.submissions.length > 0}
		<div class="flex flex-col">
			<div class="text-xl">Submissions</div>
			<div
				class="grid text-sm font-semibold text-gray-600 bg-gray-100 border-b"
				style="grid-template-columns: 80px 1fr 120px 120px 120px"
			>
				<div class="px-3 py-2">Time</div>
				<div class="px-3 py-2">Problem</div>
				<div class="px-3 py-2">Language</div>
				<div class="px-3 py-2">Verdict</div>
				<div class="px-3 py-2">Source code</div>
			</div>
			{#each data.submissions as submission, i}
				<div
					class="
						grid items-center
						text-sm
						border-b last:border-b-0
						hover:bg-white
						transition-colors
					"
					class:bg-gray-50={i % 2 === 0}
					style="grid-template-columns: 80px 1fr 120px 120px 120px"
				>
					<div class="px-3 py-2 text-gray-500 tabular-nums">
						{submission.time}
					</div>

					<div class="px-3 py-2">
						<div class="flex justify-start">
							<Problem
								problem={submission.problem}
								onclick={() => goto('/problem/' + submission.problem?.id)}
							/>
						</div>
					</div>

					<div class="px-3 py-2 font-mono text-gray-700">
						{submission.language}
					</div>

					<div class="px-3 py-2">
						<div class="flex items-center gap-2 justify-start">
							<JudgementType judgement_type={submission.judgement_type} />
							<span class="text-gray-600">{submission.judgement}</span>
						</div>
					</div>

					{#if submission.sources && submission.sources.length > 0}
						<button
							type="button"
							onclick={() => openSource(submission.sources[0].href, data.team.name + " " + submission.time + ": " + submission.problem?.label + " " + submission.judgement_type?.name)}
							class="
								inline-flex items-center gap-1
								text-blue-600 hover:text-blue-800
								hover:underline
								font-medium
							"
						>
							Source
						</button>
					{:else}
						<span class="text-gray-400 italic">—</span>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	{#if data.team.photo}
		<div class="flex flex-col">
			<div class="text-xl">Photo</div>
			<div class="flex flex-row gap-2">
				<Photo ref={data.team.photo} size={48} />
			</div>
		</div>
	{/if}

	{#if data.coaches && data.coaches.length > 0}
		<div class="flex flex-col">
			<div class="text-xl">Coaches</div>
			<div class="flex flex-row gap-2">
				{#each data.coaches as person}
					<Person {person} />
				{/each}
			</div>
		</div>
	{/if}

	{#if data.contestants && data.contestants.length > 0}
		<div class="flex flex-col">
			<div class="text-xl">Contestants</div>
			<div class="flex flex-row gap-2">
				{#each data.contestants as person}
					<Person {person} />
				{/each}
			</div>
		</div>
	{/if}
</div>

	{#if showSource}
	<div> dsadsa</div>
		<div class="fixed inset-0 z-50 flex items-center justify-center">
			<!-- Overlay -->
			<div
				class="absolute inset-0 bg-black/50"
				onclick={closeSource}
			/>

			<!-- Modal -->
			<div
				class="
					relative z-10
					bg-white rounded-lg shadow-xl
					w-[90vw] max-w-4xl
					h-[80vh]
					flex flex-col
				"
			>
				<!-- Header -->
				<div class="flex items-center justify-between px-4 py-2 border-b">
					<div class="font-semibold text-sm text-gray-700">
						Source code {sourceTitle}
					</div>
					<button
						onclick={closeSource}
						class="text-gray-400 hover:text-gray-700"
					>
						✕
					</button>
				</div>

				<!-- Content -->
				<div class="flex-1 overflow-auto">
					{#if sourceUrl}
						<iframe
							src={sourceUrl}
							class="w-full h-full"
						/>
					{/if}
				</div>
			</div>
		</div>
	{/if}
