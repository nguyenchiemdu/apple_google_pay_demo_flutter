import { StripeConfig } from "./config";
import os from 'os';
export function getKeys() {
    const secret_key: string | undefined = StripeConfig.stripeSecretKey;
    const publishable_key: string | undefined = StripeConfig.stripePublishableKey;
    return { secret_key, publishable_key };
}

export function getLocalIpAddress() {
    const ifaces = os.networkInterfaces();
    let address: string;

    Object.keys(ifaces).forEach((ifname) => {

        ifaces[ifname]?.forEach((iface) => {
            if ('IPv4' == iface.family && iface.internal == false && iface.netmask == '255.255.255.0') {
                address = iface.address;
            }
        })
    });

    return address;
}

export const calculateOrderAmount = (itemIds: string[] = ['id-1']): number => {
    const total = itemIds
        .map((id) => itemIdToPrice[id])
        .reduce((prev, curr) => prev + curr, 0);

    return total;
};

const itemIdToPrice: { [id: string]: number } = {
    'id-1': 1400,
    'id-2': 2000,
    'id-3': 3000,
    'id-4': 4000,
    'id-5': 5000,
};