// Strapi API Client for Strapi 5
// Provides type-safe functions to fetch content from Strapi CMS

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// Strapi 5 response types
export interface StrapiImage {
    id: number;
    url: string;
    alternativeText: string | null;
    width: number;
    height: number;
    formats?: {
        thumbnail?: { url: string; width: number; height: number };
        small?: { url: string; width: number; height: number };
        medium?: { url: string; width: number; height: number };
        large?: { url: string; width: number; height: number };
    };
}

export interface SiteSettings {
    id: number;
    siteName?: string;
    logo?: StrapiImage;
}

export interface Category {
    id: number;
    documentId: string;
    name: string;
    slug: string;
}

export interface Article {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    description?: string;
    content?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    cover?: StrapiImage;
    category?: Category;
    author?: {
        id: number;
        name: string;
        email?: string;
        avatar?: StrapiImage;
    };
}

export interface StrapiResponse<T> {
    data: T;
    meta?: {
        pagination?: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

/**
 * Generic fetch function for Strapi API
 */
async function fetchFromStrapi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T | null> {
    const url = `${STRAPI_URL}/api${endpoint}`;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (STRAPI_TOKEN) {
        headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...headers,
                ...options.headers,
            },
            next: { revalidate: 60 }, // Cache for 60 seconds
        });

        if (!response.ok) {
            console.error(`Strapi fetch error: ${response.status} ${response.statusText}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Strapi fetch error:', error);
        return null;
    }
}

/**
 * Get site settings including logo from Strapi
 * Expects a "site-setting" single type with a "logo" media field
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
    const response = await fetchFromStrapi<StrapiResponse<SiteSettings>>(
        '/site-setting?populate=logo'
    );

    return response?.data || null;
}

/**
 * Get the full URL for a Strapi image
 */
export function getStrapiImageUrl(image: StrapiImage | undefined | null): string | null {
    if (!image?.url) return null;

    // If URL is already absolute, return as-is
    if (image.url.startsWith('http')) {
        return image.url;
    }

    // Otherwise, prepend Strapi URL
    return `${STRAPI_URL}${image.url}`;
}

/**
 * Get all articles from Strapi
 */
export async function getArticles(options?: {
    limit?: number;
    category?: string;
    featured?: boolean;
}): Promise<Article[]> {
    let query = '/articles?populate=cover,category,author.avatar&sort=publishedAt:desc';

    if (options?.limit) {
        query += `&pagination[limit]=${options.limit}`;
    }

    if (options?.category && options.category !== 'all') {
        query += `&filters[category][slug][$eq]=${options.category}`;
    }

    const response = await fetchFromStrapi<StrapiResponse<Article[]>>(query);
    return response?.data || [];
}

/**
 * Get a single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
    const response = await fetchFromStrapi<StrapiResponse<Article[]>>(
        `/articles?filters[slug][$eq]=${slug}&populate=cover,category,author.avatar,blocks`
    );

    return response?.data?.[0] || null;
}

/**
 * Get a single article by ID
 */
export async function getArticleById(id: string | number): Promise<Article | null> {
    const response = await fetchFromStrapi<StrapiResponse<Article>>(
        `/articles/${id}?populate=cover,category,author.avatar,blocks`
    );

    return response?.data || null;
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
    const response = await fetchFromStrapi<StrapiResponse<Category[]>>(
        '/categories?sort=name:asc'
    );

    return response?.data || [];
}

/**
 * Get related articles (same category, excluding current)
 */
export async function getRelatedArticles(
    categorySlug: string,
    excludeId: number,
    limit: number = 3
): Promise<Article[]> {
    const response = await fetchFromStrapi<StrapiResponse<Article[]>>(
        `/articles?populate=cover,category&filters[category][slug][$eq]=${categorySlug}&filters[id][$ne]=${excludeId}&pagination[limit]=${limit}&sort=publishedAt:desc`
    );

    return response?.data || [];
}
