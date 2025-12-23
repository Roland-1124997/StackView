<template>
	<button type="button" @click="setFilter(type)" :class="['flex items-center justify-center gap-2 px-4 text-sm font-medium transition-colors duration-200 border rounded-lg outline-none focus:outline-none focus:ring-2', large ? 'py-2 w-full' : 'py-[0.68rem] w-fit md:py-2', getColorClasses(color, filter === type)]" :aria-pressed="filter === type">
		<Icon :name="iconName" class="w-4 h-4" aria-hidden="true" />
		<span :class="alwaysShowLabel ? 'flex' : 'hidden md:flex'">{{ label }}</span>
	</button>
</template>

<script setup lang="ts">
	const { filter, setFilter } = useFilter();

	defineProps({
		type: {
			type: String,
			required: true,
		},
		iconName: {
			type: String,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
		alwaysShowLabel: {
			type: Boolean,
			required: true,
		},
		color: {
			type: String,
			required: false,
			default: "neutral",
		},
		large: {
			type: Boolean,
			required: false,
			default: false,
		},
	});

	const getColorClasses = (color: string, isActive: boolean) => {
		const colors: Record<string, { active: string; inactive: string }> = {
			neutral: {
				active: "bg-neutral-100 text-neutral-800 border-neutral-400 focus:ring-neutral-400",
				inactive: "text-gray-700 bg-white border-gray-300 hover:bg-neutral-50 hover:text-neutral-600 focus:text-neutral-600 focus:border-neutral-500 hover:border-neutral-500 focus:ring-neutral-400",
			},
			blue: {
				active: "bg-blue-100 text-blue-800 border-blue-400 focus:ring-blue-300",
				inactive: "text-gray-700 bg-white border-gray-300 hover:bg-blue-50 hover:text-blue-600 focus:text-blue-600 focus:border-blue-500 hover:border-blue-500 focus:ring-blue-300",
			},
			red: {
				active: "bg-red-100 text-red-800 border-red-400 focus:ring-red-300",
				inactive: "text-gray-700 bg-white border-gray-300 hover:bg-red-50 hover:text-red-600 focus:text-red-600 focus:border-red-500 hover:border-red-500 focus:ring-red-300",
			},
		};

		return isActive ? colors[color]?.active : colors[color]?.inactive;
	};
</script>
