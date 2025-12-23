const createButton = (overrides: Record<string, any>) => ({
    iconName: "akar-icons:edit",
    ...overrides,
});

const createFilter = (type: string, iconName: string, label: string, ariaLabel: string, color: string, large: boolean, alwaysShowLabel = true) => ({
    type, iconName, label, alwaysShowLabel, ariaLabel, color, large,
});

const createSearch = (context: string) => ({
    label: `Zoek in ${context}`,
    placeholder: `Zoek ${context}...`,
});

const createRequest = (overrides: Record<string, any>) => ({
    name: "Voorbeeld Request",
    endpoint: "/api/example",
    ...overrides,
});

const routes = cachedFunction(() => {

    return {
        "/": {
            label: "Dashboard",
            iconName: "akar-icons:dashboard",
            requests: [
                createRequest({
                    name: "analytics",
                    endpoint: "/api/umami/analytics",
                })
            ]
        },
        "/notifications": {
            label: "Notificaties",
            iconName: "akar-icons:inbox",
            alert: true,
            toolbar: {
                stacked: true,
                groupWithFilters: true,
                buttons: [
                    createButton({
                        to: "/compose",
                        description: "Nieuw bericht schrijven",
                        isSmall: true,
                    }),
                ],
                filters: [
                    createFilter("all", "akar-icons:filter", "Alles", "Toon alle berichten", "neutral", false, false),
                    createFilter("gelezen", "akar-icons:open-envelope", "Gelezen", "Zoek gelezen berichten", "blue", true),
                    createFilter("ongelezen", "akar-icons:envelope", "Ongelezen", "Zoek ongelezen berichten", "red", true),
                ],
                search: createSearch("artikelen"),
            },
        },
        "/articles": {
            label: "Artikelen",
            iconName: "akar-icons:newspaper",
            toolbar: {
                stacked: false,
                buttons: [
                    createButton({
                        to: "/articles/compose",
                        description: "Nieuw artikel schrijven",
                    }),
                ],
                search: createSearch("artikelen"),
            },
            requests: [
                createRequest({
                    name: "articles",
                    endpoint: "/api/articles",
                })
            ]
        },
        "/storage": {
            label: "Storage",
            iconName: "akar-icons:folder",
            toolbar: {
                stacked: false,
                buttons: [
                    createButton({
                        iconName: "akar-icons:cloud-upload",
                        description: "Bestanden uploaden",
                        isButton: true,
                        onClick: "triggerFileSelect",
                    }),
                    createButton({
                        iconName: "akar-icons:arrow-right-left",
                        description: "Bestanden synchroniseren",
                        isButton: true,
                        onClick: "refresh",
                    }),
                ],
                search: createSearch("bestanden"),
            }
        },
        "/account": {
            label: "Account",
            iconName: "akar-icons:person",
        },
        "/portfolio": {
            label: "Portfolio",
            iconName: "akar-icons:telescope",
        }
    }
}, {
    maxAge: 60 * 60,
    name: 'route-configuration',
});

export default defineSupabaseEventHandler( (event) => routes());