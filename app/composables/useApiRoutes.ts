export const useApiRoutes = async () => {

    const routes = useState<Record<string, RouteType>>('api-routes', () => ({}));
    const route = useRoute();
    const current = ref<string>(route.path);

    const toolbar = computed(() => {
        current.value = route.path;
        return routes.value[current.value]?.toolbar;
    });

    const useResponse = async () => {

        const requests = computed(() => {
            current.value = route.path;
            return routes.value[current.value]?.requests;
        });

        return await useRequests(requests.value || []);

    }

    const { data, error } = await useFetch<Record<string, RouteType>>("/api/configuration/routes", {
        key: 'api-routes-fetch',
    });

    if (!error.value && data.value) routes.value = data.value;

    return {
        routes,
        toolbar,
        useResponse
    };
}

const useRequests = async (requests: requests[]) => {

    const results = await Promise.all(
        requests.map(async (request) => {
            const { data } = await useFetch<ApiResponse<unknown>>(request.endpoint);
            return { [request.name]: ref(data.value?.data || null) };
        })
    );

    return Object.assign({}, ...results);
}

