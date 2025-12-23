import { networkInterfaces } from 'os';

const whiteList: string[] = ["localhost"];

const { whitelistedDomains, production } = useRuntimeConfig();
whitelistedDomains?.split(',').forEach((domain: string) => {
    whiteList.push(domain.trim());
});

if (!production) {

    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
        
        const netArray = nets[name];
        if (!netArray) continue;

        for (const net of netArray) {

            const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
            if (net.family === familyV4Value && !net.internal) whiteList.push(net.address);
        }
    }
}

export default defineEventHandler(async (event) => {

    const host = getRequestHeader(event, 'host')?.split(':')[0];

    if(!host || !whiteList.includes(host)) return useReturnResponse(event, {
        status: {
            code: 403,
            success: false,
            message: 'Domein staat niet op de whitelist',
        }
    });
});