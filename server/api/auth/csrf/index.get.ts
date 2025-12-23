const rotateToken = () => {

    const token = (crypto?.randomUUID?.() ||
        `${Date.now().toString(36)}.${Math.random().toString(36).slice(2)}.${Math.random()
            .toString(36)
            .slice(2)}`)
        .replace(/\./g, "-");

    useStorage(`csrf-tokens`).setItem(token, true, { ttl: 60 * 10 });

    return token;
};

export default defineEventHandler(async (event) => {

    const token = rotateToken();

    return useReturnResponse(event, {
        status: {
            code: 200,
            success: true,
            message: 'CSRF token gegenereerd',
        },
        data: {
            csrfToken: token,
        },
    });
})
