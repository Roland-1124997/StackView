
import type { FetchUrl, SendOptions, MethodOptions, ErrorResponse, ApiResponse } from "#shared/types";

const catcher = async <T>(promise: Promise<T>) => {

    try {
        const data = await promise;
        return { data, error: null };
    }

    catch (error: any) {
        return { data: null, error: error.data.error as ErrorResponse };
    }
}

export const useCsrfToken = async () => {

    let token = ""

    const { data, error } = await catcher<ApiResponse<{ csrfToken: string }>>($fetch("/api/auth/csrf"));
    if (!error) token = data?.data?.csrfToken || "";

    return token
}

export const useApiHandler = <G>(url: FetchUrl) => {

    const Send = <T = G>(options?: SendOptions) => {
        const extendedUrl = options?.extends ? `${url}${options.extends}` : url;
        return catcher<T>($fetch(extendedUrl, {
            ...options
        })
    )}

    const Get = <T = G>(options?: MethodOptions) => Send<T>({
        ...options, method: 'GET'
    })

    const Post = async <T = G>(options?: MethodOptions) => Send<T>({
        ...options, method: 'POST', headers: {
            'X-CSRF-Token': await useCsrfToken()
        }
    })

    const Delete = async <T = G>(options?: MethodOptions) => Send<T>({
        ...options, method: 'DELETE', headers: {
            'X-CSRF-Token': await useCsrfToken()
        }
    })

    const Patch = async <T = G>(options?: MethodOptions) => Send<T>({
        ...options, method: 'PATCH', headers: {
            'X-CSRF-Token': await useCsrfToken()
        }
    })

    return {
        Send, Get, Post, Delete, Patch
    }
}