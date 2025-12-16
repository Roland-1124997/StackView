<template>
	<div class="fixed top-0 w-full h-full">
		<header class="fixed top-0 z-50 w-full bg-white">
			<div class="flex items-center justify-between max-w-5xl px-4 py-4 mx-auto border-b lg:px-0">
				<Breadcrumbs />

				<div class="flex items-center gap-2">
					<UtilsButton to="/articles" iconName="akar-icons:newspaper" :options="{ name: 'Artikelen' }" />
					<UtilsButton to="/profile" iconName="akar-icons:person" :options="{ name: 'Profile' }" />
					<UtilsButton @click="notificationsStore.requestPermission()" to="/notifications" iconName="akar-icons:inbox" :options="notificationsOptions" />
					<UtilsButtonAction iconName="akar-icons:door" :options="{ name: 'Logout', hidden: true }" @click="logout" />
				</div>
			</div>
		</header>

		<div class="relative z-10 w-full px-4 py-3 mx-auto mt-8 overflow-x-hidden overflow-y-auto h-fit md:mt-0 sm:px-6 lg:px-24">
			<div class="max-w-5xl mx-auto mt-8 md:mt-20 h-[85dvh]">
				<div class="flex flex-col md:flex-row">
					<main class="md:pl-4 h-[85dvh] w-full overflow-scroll relative">
						<UtilsDotPattern class="z-0 opacity-60" :width="20" :height="20" :cx="1" :cy="1" :cr="1" />

						<slot></slot>
					</main>
				</div>
			</div>
		</div>

		<UtilsToast />
		<div class="fixed z-50 w-screen h-screen">
			<Modal />
		</div>
	</div>
</template>

<script setup lang="ts">
	const { addToast } = useToast();

	const store = useSessionsStore();

	const storageStore = useStorageStore();
	const notificationsStore = useNotificationsStore();

	await storageStore.initialPayload();
	await notificationsStore.initialPayload();

	const { close: closeStorage } = await storageStore.realTime();
	const { close: closeNotifications } = await notificationsStore.realTime();

	const notificationsOptions = computed(() => ({
		name: "Notificaties",
		count: notificationsStore.unseen,
	}));

	const Request = useApiHandler<ApiResponse<any>>("/api/auth/logout");

	const logout = async () => {
		const { data, error } = await Request.Post();

		if (error)
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
		closeStorage();
		closeNotifications();
	});

</script>
