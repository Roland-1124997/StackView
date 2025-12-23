export default defineEventHandler(async (event) => {

    const ignoredMethods = ['GET', 'HEAD', 'OPTIONS'];
    const ignorePath = ['api/savory'];
    const method = event.method.toUpperCase();
    const path = event.path
    
    if (ignoredMethods.includes(method)) return;
    if (ignorePath.includes(path)) return;

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