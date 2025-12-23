<template>
	<div>
		<section v-if="analytics" class="relative grid grid-cols-2 gap-4 md:grid-cols-4">
			<article v-for="statistics in analytics.statistics" :key="statistics.label" class="z-10 w-full p-6 bg-white border rounded-lg">
				<h2 class="text-sm font-semibold text-gray-700">{{ statistics.label }}</h2>
				<h3 class="mt-4 text-2xl font-extrabold text-gray-900">{{ useFormatDuration(statistics.value, statistics.format) }}</h3>
				<p :title="`${useFormatDuration(statistics.difference, statistics.format)}`" class="mt-3">
					<span :class="statistics.positive ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'" class="inline-flex items-center px-2 py-1 text-sm font-medium rounded">
						<span class="mr-2" aria-hidden="true">{{ statistics.positive ? "▲" : "▼" }}</span>
						{{ statistics.percentage | 0 }}%
					</span>
				</p>
			</article>
		</section>
		<section v-else class="relative z-10 flex items-center justify-center w-full h-32 mt-4 bg-white border rounded-lg">
			<p class="text-gray-500">
				{{ !analytics ? "Fout bij het laden van analytics." : "Laden van analytics..." }}
			</p>
		</section>

		<section class="relative pb-[5.5rem] mt-3 md:pb-0">
			<nav class="flex items-end justify-between py-2 pb-3 mb-3 border-y pr-[0.11rem]">
				<div>
					<h2 class="text-2xl font-bold">Pagina's</h2>
					<p class="text-gray-600 text-balance">Overzicht van de weergaven van je pagina's in de afgelopen periode.</p>
				</div>

				<button class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 bg-white border border-gray-300 rounded-lg w-fit hover:bg-blue-50 hover:text-blue-600 focus:text-blue-600 focus:border-blue-500 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300" aria-label="toggle table" @click="togleTable()">
					<icon :name="!isTableEnabled ? 'akar-icons:full-screen' : 'akar-icons:normal-screen'" class="w-4 h-4" aria-hidden="true" />
					<span class="sr-only">{{ isTableEnabled ? "Grafiekweergave" : "Tabelweergave" }}</span>
				</button>
			</nav>

			<article v-if="analytics" class="w-full p-6 overflow-hidden z-10 bg-white border rounded-lg h-fit min-h-[16rem]">
				<div class="px-6 -mx-6 overflow-x-auto">
					<div v-if="metricsPages.values.length <= 0" class="flex items-center justify-center min-h-[14rem]">
						<p class="text-center text-gray-500">Geen gegevens beschikbaar voor de geselecteerde periode.</p>
					</div>

					<ChartsTable v-else-if="isTableEnabled" title="Pagina's" :data="metricsPages.values" :categories="metricsPages.categories" />
					<client-only v-else>
						<ChartsBar :data="metricsPages.values" :categories="metricsPages.categories" :height="350" :y_axis="['bezoekers', 'weergaven', 'bezoeken']" />

						<template #fallback>
							<div class="flex text-center items-center justify-center min-h-[14rem]">
								<p class="text-gray-500">Laden van de grafiek...</p>
							</div>
						</template>
					</client-only>
				</div>
			</article>
			<article v-else class="relative z-10 flex items-center justify-center w-full h-32 bg-white border rounded-lg">
				<p class="text-gray-500">
					{{ !analytics ? "Fout bij het laden van analytics." : "Laden van analytics..." }}
				</p>
			</article>
		</section>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: "authorized",
	});

	useSeoMeta({
		title: "Analytics Dashboard",
		description: "Bekijk een overzicht van de algemene statistieken van je website, inclusief bezoekers, weergaven en bezoekduur.",
		ogTitle: "Analytics Dashboard",
		ogDescription: "Bekijk een overzicht van de algemene statistieken van je website, inclusief bezoekers, weergaven en bezoekduur.",
		ogUrl: "/",
		ogImage: "/icons/icon_512.png",
		twitterTitle: "Analytics Dashboard",
		twitterDescription: "Bekijk een overzicht van de algemene statistieken van je website, inclusief bezoekers, weergaven en bezoekduur.",
		twitterImage: "/icons/icon_512.png",
		twitterCard: "app",
	});

	useHead({
		htmlAttrs: {
			lang: "nl",
		},
		link: [
			{
				rel: "icon",
				type: "image/png",
				href: "/icons/icon_512.png",
			},
		],
	});

	const { useResponse } = await useApiRoutes();
	const { analytics }: { analytics: Record<string, any> } = await useResponse();

	const route = useRoute();
	const router = useRouter();

	const isMobile = ref(false);
	const isTableEnabled = ref(route.query.table === "true");

	const metricsPages = computed(() => {
		if (!analytics.value?.metrics?.pages) return null;

		if (isMobile.value && !isTableEnabled.value)
			return {
				...analytics.value.metrics.pages,
				values: analytics.value.metrics.pages.values.slice(0, 3),
				categories: analytics.value.metrics.pages.categories,
			};

		return analytics.value.metrics.pages;
	});

	const togleTable = () => {
		isTableEnabled.value = !isTableEnabled.value;
		router.push({ query: { table: `${isTableEnabled.value}` } });
	};

	onMounted(() => {
		isMobile.value = window.innerWidth < 768;
		window.addEventListener("resize", () => {
			isMobile.value = window.innerWidth < 768;
		});
	});

	onUnmounted(() => {
		window.removeEventListener("resize", () => {
			isMobile.value = window.innerWidth < 768;
		});
	});
</script>
