
export const useNotificationsStore = defineStore("Notifications", () => {

    const Request = useApiHandler<ApiResponse<any>>("/api/notifications")
    const { create, close } = useModal();
    const { addToast } = useToast();
    const { setBadge } = useBadge();

    const messages = ref<any[]>([]);
    const unseen = ref<number>(0);
    const error = ref<any | null>(null);

    const storedPayload = useLocalStorage<string | null>("notification:payload", null);
    const savePayload = async (payload: any) => storedPayload.value = JSON.stringify(payload);
    const clearSavedPayload = () => storedPayload.value = null

    const getSavedPayload = () => {
        if (storedPayload.value) return JSON.parse(storedPayload.value);
        return null;
    }

    const refresh = async () => {

        const { data, error: Error } = await Request.Get();

        if (!Error && data) {
            messages.value = data.data?.messages || [];
            unseen.value = data.data?.unseen || 0;
        }

        else error.value = Error;

    }

    const initialPayload = async () => {

        const { data, error: Error } = await useFetch('/api/notifications');

        if (!Error.value && data.value) {
            messages.value = data.value?.data.messages || [];
            unseen.value = data.value?.data.unseen || 0;
        }

        else error.value = Error.value;
    }

    const realTime = async () => {

        const event_id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const { data: events, error: Error, close } = useEventSource(`/realtime/${event_id}/notifications/`, [], {
            autoReconnect: true,
        });

        watch(events, async () => await refresh());
        watch(unseen, async (count) => await setBadge(count));

        if (Error.value) error.value = Error.value;

        return { close }
    };

    const markAsSeen = async (message: any) => {

        if ((message.flags).includes("\\Seen")) return

        const { error } = await Request.Patch({
            extends: `/${message.uid}`,
            query: { action: "markAsSeen", type: message.origin },
        })

        if (error) return addToast({
            type: "error",
            message: `Error marking notification as seen: ${error}`,
        });
    };

    const markAsUnseen = async (message: any) => {

        if (!(message.flags).includes("\\Seen")) return

        const { error } = await Request.Patch({
            extends: `/${message.uid}`,
            query: { action: "markAsUnseen", type: message.origin },
        })

        if (error) return addToast({
            type: "error",
            message: `Error marking notification as unseen: ${error}`,
        });
    };


    const requestPermission = async () => {

        if (!("Notification" in window) || Notification.permission !== "default") return;
        
        Notification.requestPermission()
            .then((permission) => {

                if (permission !== 'granted') {
                    addToast({
                        message: `Notification permisions denied`,
                        type: "error",
                        duration: 5000,
                    })
                    return
                }

                addToast({
                    message: `Notification permissions granted`,
                    type: "success",
                    duration: 5000,
                })

                return navigator.serviceWorker.ready
            })

            .catch((error) => addToast({
                message: `Error requesting notification permissions: ${error}`,
                type: "error",
                duration: 5000,
            }));
    };


    const deleteMessage = async (message: any) => {

        const onConfirm = async () => {

            const { error } = await Request.Delete({
                extends: `/${message.uid}`,
                query: { type: message.origin },
            })

            close();
            await refresh();

            if (error) return addToast({
                type: "error",
                message: `Error deleting notification: ${error}`,
            });

            addToast({
                type: "success",
                message: "Notification deleted successfully",
            });
        }

        const onCancel = () => {

            close();
            addToast({
                type: "info",
                message: "Verwijderen geannuleerd",
            });
        }

        create({
            name: "Confirmatie-Modal",
            description: "Weet je zeker dat je dit bericht wilt verwijderen? Dit kan niet ongedaan worden gemaakt.",
            component: "Confirm",
            props: { onConfirm, onCancel, message, type: "bericht" }
        });
    };

    return {
        messages,
        unseen,
        error,
        clearSavedPayload,
        savePayload,
        getSavedPayload,
        initialPayload,
        realTime,
        markAsSeen,
        markAsUnseen,
        deleteMessage,
        requestPermission,
    };
});

