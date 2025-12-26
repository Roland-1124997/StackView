<template>
	<div class="fixed flex w-full h-screen overflow-hidden">
		<aside :class="['fixed inset-y-0 left-0 z-[60] w-64 bg-gray-50 border-r transform transition-transform md:transition-none duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0', isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full']">
			<div class="flex flex-col h-full">
				<div class="flex items-center justify-between h-16 px-4 border-b">
					<div class="flex items-center space-x-3">
						<div class="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
							<img src="\icons\icon_512-blue.svg" alt="Buildboard Logo" draggable="false" class="rounded-lg w-7 h-7" />
						</div>
						<h1 class="text-xl font-bold text-gray-800">Buildboard</h1>
					</div>

					<button @click="isMobileMenuOpen = false" class="flex items-center justify-center p-2 rounded-lg lg:hidden hover:bg-gray-100">
						<Icon name="akar-icons:cross" class="w-5 h-5" />
						<span class="sr-only">Sluit menu</span>
					</button>
				</div>

				<nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
					<NuxtLink v-for="(route, to) in routes" :key="to" :to="`${to}`" :class="routerActiveRelatedClass(to)" class="flex items-center gap-3 px-3 py-2 text-gray-700 transition-colors rounded-lg hover:bg-blue-100 hover:text-blue-800" @click="isMobileMenuOpen = false">
						<Icon :name="route.iconName" class="w-5 h-5" />
						<span class="flex-1">{{ route.label }}</span>
						<span v-if="route.alert && notificationsStore.unseen > 0" class="px-2 py-0.5 flex items-center justify-center text-xs font-medium text-white bg-red-600 rounded-full">
							{{ notificationsStore.unseen }}
						</span>
					</NuxtLink>
				</nav>

				<div class="p-3 mb-3 border-t md:mb-0">
					<button @click="logout" class="flex items-center w-full gap-3 px-3 py-2 text-gray-700 transition-colors rounded-lg hover:bg-red-50 hover:text-red-600">
						<Icon name="akar-icons:door" class="w-5 h-5" />
						<span>Uitloggen</span>
					</button>
				</div>
			</div>
		</aside>

		<div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false" class="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden"></div>

		<div class="flex flex-col flex-1 w-full overflow-hidden">
			<header class="z-40 flex items-center justify-between h-16 px-4 bg-white border-b lg:px-6">
				<div class="flex items-center gap-4">
					<button @click="isMobileMenuOpen = true" class="flex items-center justify-center p-2 rounded-lg lg:hidden hover:bg-gray-100">
						<Icon name="akar-icons:text-align-justified" class="w-5 h-5" />
						<span class="sr-only">Open menu</span>
					</button>

					<Breadcrumbs />
				</div>
				<div class="sticky top-0 left-0 flex items-center justify-between w-full gap-2 p-1"></div>

				<div class="flex items-center gap-2 md:hidden">
					<UtilsButton @click="notificationsStore.requestPermission()" to="/notifications" iconName="akar-icons:inbox" :options="{ count: notificationsStore.unseen }" />
				</div>
			</header>

			<div class="hidden">
				<label class="sr-only" for="file">file</label>
				<input id="file" ref="inputRef" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar" @change="handleFileSelect" class="sr-only" />
			</div>

			<div v-if="toolbar" :class="toolbar?.stacked ? 'flex-col h-[6.8rem] pt-[0.67rem]' : 'h-16 items-center justify-between'" class="z-40 flex gap-2 px-4 bg-white border-b lg:px-4">
				<UtilsInputSearch name="search" :label="toolbar.search.label" :placeholder="toolbar.search.placeholder" />

				<div v-if="toolbar?.groupWithFilters" class="flex items-center gap-[0.35rem]">
					<UtilsButtonImportant v-for="(btn, index) in toolbar.buttons" :key="index" :to="btn.to" :icon-name="btn.iconName" :description="btn.description" :isButton="btn.isButton" :isSmall="btn.isSmall" @click="btn.onClick === 'triggerFileSelect' ? triggerFileSelect() : btn.onClick === 'refresh' ? storageStore.refresh() : undefined" />

					<UtilsButtonFilter v-for="filterItem in toolbar.filters" :always-show-label="filterItem.alwaysShowLabel" :key="filterItem.type" :type="filterItem.type" :iconName="filterItem.iconName" :label="filterItem.label" :color="filterItem.color" :large="filterItem.large" />
				</div>

				<template v-else-if="toolbar?.buttons">
					<UtilsButtonImportant v-for="(btn, index) in toolbar.buttons" :key="index" :to="btn.to" :icon-name="btn.iconName" :description="btn.description" :isButton="btn.isButton" :isSmall="btn.isSmall" @click="btn.onClick === 'triggerFileSelect' ? triggerFileSelect() : btn.onClick === 'refresh' ? storageStore.refresh() : undefined" />
				</template>
			</div>

			<main class="flex-1 p-4 overflow-y-auto">
				<div class="mx-auto max-w-7xl">
					<slot></slot>
				</div>
			</main>
		</div>

		<UtilsToast />
		<div class="fixed z-[100] w-screen h-screen pointer-events-none">
			<div class="pointer-events-auto">
				<Modal />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const store = useSessions();
	const storageStore = useStorage();
	const notificationsStore = useNotifications();

	const { routes, toolbar } = await useApiRoutes();

	const { addToast } = useToast();
	const isMobileMenuOpen = ref(false);

	const inputRef = ref<HTMLInputElement | null>(null);

	const triggerFileSelect = () => inputRef.value?.click();

	const handleFileSelect = async (event: Event) => {
		const input = event.target as HTMLInputElement;

		if (input.files) {
			await storageStore.upload(input.files);
			input.value = "";
		}
	};

	const routerActiveRelatedClass = (to: string) => {
		const route = useRoute();

		const path = route.path.replace("/", "");
		const target = to.replace("/", "");

		const className = "router-link-related-active";
		const isRelated = to !== "/" && path.startsWith(target);

		return isRelated ? className : "";
	};

	await notificationsStore.initialPayload();

	const { close: closeNotifications } = await notificationsStore.realTime();

	const Request = useApiHandler<ApiResponse<any>>("/api/auth/logout");

	const logout = async () => {
		const { data, error } = await Request.Post();

		if (error || !data)
			return addToast({
				message: "Er is een fout opgetreden bij het uitloggen",
				type: "error",
			});

		const redirect = data.status.redirect;
		store.clearSession();

		addToast({
			message: "Je bent succesvol uitgelogd",
			type: "success",
		});

		return navigateTo(redirect);
	};

	onUnmounted(() => {
		closeNotifications();
	});
</script>

<style scoped>
	.router-link-related-active {
		@apply text-blue-800 bg-blue-50 hover:bg-blue-100;
	}

	.router-link-active {
		@apply text-blue-800 bg-blue-100 hover:bg-blue-100;
	}
</style>
