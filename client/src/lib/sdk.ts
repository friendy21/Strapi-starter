import { getStrapiURL } from "@/lib/utils";
import { strapi } from '@strapi/client';

// Lazy initialization to avoid SDK crash during Docker build
// when STRAPI_BASE_URL is not set
let _sdk: ReturnType<typeof strapi> | null = null;

function getSdk() {
    if (!_sdk) {
        const baseUrl = getStrapiURL();
        // Only initialize if we have a valid URL
        if (baseUrl && baseUrl.startsWith('http')) {
            _sdk = strapi({ baseURL: baseUrl + "/api" });
        } else {
            // Return a mock SDK that throws helpful errors
            throw new Error(`Strapi SDK not available - STRAPI_BASE_URL is not set or invalid: "${baseUrl}"`);
        }
    }
    return _sdk;
}

// Export a proxy that lazily initializes the SDK
const sdk = new Proxy({} as ReturnType<typeof strapi>, {
    get(_, prop) {
        return getSdk()[prop as keyof ReturnType<typeof strapi>];
    }
});

export default sdk;
