<template>
	<div class="">
		<div class="z-20 w-full pt-1 pb-3 border-b">
			<div class="flex items-center justify-between w-full gap-2 text-2xl font-bold">
				<h1>Artikelen</h1>
			</div>
			<p class="w-full text-gray-600 text-pretty">Overzicht van alle artikelen van je website, deze kun je hier lezen en bewerken.</p>
		</div>

		<div class="grid gap-3 mt-4 md:grid-cols-3 pb-[5.5rem] md:pb-0">
			<div v-for="art in filteredArticles" :key="art.id" class="z-10 flex flex-col h-full p-4 duration-150 bg-white border rounded-lg group hover:bg-gray-50">
				<div class="flex flex-col flex-1 gap-4">
					<div class="relative flex flex-col flex-1">
						<div class="flex items-end justify-between mb-1">
							<h2 class="text-lg font-bold leading-tight capitalize text-slate-900">{{ art.title }}</h2>

							<div class="flex items-center gap-1 p-[0.29rem] px-2 text-xs text-gray-100 rounded-lg w-fit bg-neutral-900 font-mono hover:bg-neutral-800 select-none">
								<NuxtLink class="flex items-center justify-center gap-1 hover:text-gray-300" :to="`/articles/compose?edit=${art.id}`">
									<icon name="akar-icons:edit" class="w-4 h-4" aria-hidden="true" />
									<span class="hidden md:inline">Bewerken</span>
								</NuxtLink>
								<span aria-hidden>|</span>

								<button aria-label="verwijder artikel" class="flex items-center justify-center gap-1 hover:text-gray-300" @click="deleteArticle(art.id)">
									<icon name="akar-icons:trash" class="w-4 h-4" aria-hidden="true" />
									<span class="sr-only">Verwijderen</span>
								</button>
							</div>
						</div>

						<img :src="art.thumbnail_url" :alt="`afbeedling van artikel ${art.title}`" class="object-cover w-full h-48 my-3 border rounded-lg md:h-56 bg-gray-50" />

						<div class="flex flex-wrap items-center gap-2 mb-2">
							<span v-for="topic in art.topics" :key="topic" class="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-md">
								{{ topic }}
							</span>
						</div>

						<p class="mb-3 text-sm text-gray-600 line-clamp-2 md:line-clamp-3">{{ art.description || "Geen beschrijving beschikbaar" }}</p>
						<div class="flex items-center gap-3 mt-auto text-xs text-gray-600 group-hover:text-gray-800">
							<span v-if="art.words" aria-label="hoeveelheid woorden" class="flex items-center gap-1">
								<icon name="akar-icons:file" class="w-4 h-4" aria-hidden="true" />
								<span class="text-gray-500">{{ art.words }} woorden</span>
							</span>
							<span v-if="art.read_time" aria-label="gemiddelde leestijd" class="flex items-center gap-1">
								<icon name="akar-icons:clock" class="w-4 h-4" aria-hidden="true" />
								<span class="text-gray-500">{{ art.read_time }} min</span>
							</span>
							<span v-if="art.updated_at" aria-label="laatst aangepast op" class="flex items-center gap-1">
								<icon name="akar-icons:history" class="w-4 h-4" aria-hidden="true" />
								<NuxtTime :datetime="art.updated_at" year="2-digit" month="2-digit" day="2-digit" hour="2-digit" minute="2-digit" class="text-gray-500" />
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: "authorized",
	});

	useSeoMeta({
		title: "Artikelen Dashboard",
		description: "Overzicht van alle artikelen en blog posts.",
		ogTitle: "Artikelen Dashboard",
		ogDescription: "Overzicht van alle artikelen en blog posts.",
		ogUrl: "/articles",
		ogImage: "/icons/icon_512.svg",
		twitterTitle: "Artikelen Dashboard",
		twitterDescription: "Overzicht van alle artikelen en blog posts.",
		twitterImage: "/icons/icon_512.svg",
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

	
	const { search } = useSearch()
	const query = computed(() => search.value || "");

	const { create, close } = useModal();
	const { addToast } = useToast();

	const { useResponse } = await useApiRoutes();
	const { articles }: { articles: Record<string, any> } = await useResponse();
	
	const Request = useApiHandler<ApiResponse<Record<string, any>>>("/api/articles");

	const filteredArticles = computed(() => {
		let filtered = articles.value || [];

		if (query.value) {
			filtered = filtered.filter((message: any) => {
				const title = message.title || "";
				const description = message.description || "";

				return title.toLowerCase().includes((query.value as string).toLowerCase()) || description.toLowerCase().includes((query.value as string).toLowerCase());
			});
		}

		return filtered;
	});

	const deleteArticle = async (id: string) => {
		const content = articles.value.find((art: any) => art.id === id);

		const onConfirm = async () => {
			const { error } = await Request.Delete({ extends: `/${id}` });

			close();

			if (error)
				return addToast({
					message: "Er is een fout opgetreden bij het verwijderen van het artikel",
					type: "error",
				});

			articles.value = articles.value.filter((art: any) => art.id !== id);

			addToast({
				message: "Artikel succesvol verwijderd",
				type: "success",
			});
		};

		const onCancel = () => {
			close();
			addToast({
				message: "Verwijderen geannuleerd",
				type: "info",
			});
		};

		create({
			name: "Confirmatie-Modal",
			description: "Weet je zeker dat je dit artikel wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.",
			component: "Confirm",
			props: { onConfirm, onCancel, message: content, type: "artikel" },
		});
	};
</script>
