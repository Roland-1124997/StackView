export default defineEventHandler(async (event) => {

    const ignoredMethods = ['GET', 'HEAD', 'OPTIONS'];
    const method = event.method.toUpperCase();
    
    if (ignoredMethods.includes(method)) return;
    
    const token = getRequestHeader(event, 'x-csrf-token');
    const stored = useStorage(`csrf-tokens`);
    const isValid = token ? await stored.getItem(token) : false;

    if (isValid) {
        await stored.removeItem(token as string);
        return
    }

    return useReturnResponse(event, {
        status: {
            code: 403,
            success: false,
            message: 'Ongeldige CSRF token',
        },
    });

});