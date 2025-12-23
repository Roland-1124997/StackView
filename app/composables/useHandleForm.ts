const { addToast } = useToast();

export const useHandleForm = (request: requestOptions, callback?: Function ) => {
    const loading = ref(false);
    
    const handleSubmit = async (values: Record<string, unknown>, actions: FormActions<any>) => {
        loading.value = true;

        const { data, error } = await useApiHandler<ApiResponse<unknown>>(request.url).Send({
            method: request.method,
            body: callback ? await callback(values) : values,
            headers: { 'X-CSRF-Token': await useCsrfToken() }
        });

        await new Promise((resolve) => setTimeout(resolve, 500));
        loading.value = false;

        if (error) errorHandler(error, request, actions);
        if (data) successHandler(data, request);
    }

    return { loading, handleSubmit };
}

const errorHandler = (error: ErrorResponse, request: requestOptions, actions: FormActions<any>) => {
    if (request.onfailure) request.onfailure(error);
    
    else {
        const details = error.details as Record<string, string>;
        actions.setErrors(details)
    }

    return;
}

const successHandler = (data: ApiResponse<unknown>, request: requestOptions) => {
    const status = data.status;
    const redirect = status.redirect

    if (status) {

        if (request.onsuccess) request.onsuccess(data);

        if (request.successMessage) addToast({
            type: "success",
            message: request.successMessage,
            duration: 5000,
        });
            
        if (redirect) navigateTo(redirect);
        
    }
}


