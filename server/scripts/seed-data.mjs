/**
 * Seed script to add mock data to Strapi
 * Run with: node scripts/seed-data.mjs
 */

const STRAPI_URL = 'http://localhost:1337';

// You need to create an API token in Strapi Admin:
// Settings -> API Tokens -> Create new API Token (Full access)
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';

async function seedData() {
    if (!API_TOKEN) {
        console.log('⚠️  No API token provided.');
        console.log('Please create an API token in Strapi Admin:');
        console.log('1. Go to Settings -> API Tokens');
        console.log('2. Create new API Token with "Full access"');
        console.log('3. Run: STRAPI_API_TOKEN=your-token node scripts/seed-data.mjs');
        console.log('\nAttempting to seed without token (might fail)...\n');
    }

    const headers = {
        'Content-Type': 'application/json',
        ...(API_TOKEN && { 'Authorization': `Bearer ${API_TOKEN}` })
    };

    // Seed Global data
    console.log('📝 Seeding Global content...');
    try {
        const globalData = {
            data: {
                title: 'My Strapi Site',
                description: 'A modern website built with Strapi and Next.js',
                topNav: {
                    logoText: 'Strapi',
                    navItems: [
                        { href: '/', text: 'Home', isExternal: false, isPrimary: false },
                        { href: '/blog', text: 'Blog', isExternal: false, isPrimary: false },
                        { href: '/about', text: 'About', isExternal: false, isPrimary: false }
                    ],
                    cta: { href: '/contact', text: 'Get Started', isExternal: false, isPrimary: true }
                },
                footer: {
                    text: '© 2024 Strapi. All rights reserved.',
                    socialLinks: [
                        { href: 'https://twitter.com', text: 'Twitter', isExternal: true, isPrimary: false },
                        { href: 'https://github.com', text: 'GitHub', isExternal: true, isPrimary: false }
                    ]
                }
            }
        };

        const globalRes = await fetch(`${STRAPI_URL}/api/global`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(globalData)
        });

        if (globalRes.ok) {
            console.log('✅ Global content seeded');

            // Publish Global
            await fetch(`${STRAPI_URL}/api/global?status=published`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ data: { ...globalData.data } })
            });
            console.log('✅ Global content published');
        } else {
            const err = await globalRes.text();
            console.log('❌ Failed to seed Global:', err);
        }
    } catch (e) {
        console.log('❌ Error seeding Global:', e.message);
    }

    // Seed Landing Page data
    console.log('\n📝 Seeding Landing Page content...');
    try {
        const landingPageData = {
            data: {
                title: 'Welcome to Our Site',
                description: 'Discover amazing content and features',
                blocks: [
                    {
                        __component: 'layout.hero',
                        heading: 'Build Amazing Websites with Strapi',
                        text: 'Strapi is the leading open-source headless CMS. It\'s 100% JavaScript/TypeScript, fully customizable, and developer-first.',
                        topLink: { href: '#features', text: 'Learn More', isExternal: false, isPrimary: false },
                        buttonLink: [
                            { href: '/blog', text: 'Read Blog', isExternal: false, isPrimary: true },
                            { href: 'https://github.com/strapi/strapi', text: 'GitHub', isExternal: true, isPrimary: false }
                        ]
                    },
                    {
                        __component: 'layout.section-heading',
                        heading: 'Why Choose Strapi?',
                        subHeading: 'Features that make development a breeze'
                    },
                    {
                        __component: 'layout.card-grid',
                        cards: [
                            {
                                heading: 'Fully Customizable',
                                text: 'Customize everything from the data model to the Admin panel.'
                            },
                            {
                                heading: 'Developer First',
                                text: 'Build faster with auto-generated APIs and powerful plugins.'
                            },
                            {
                                heading: 'Self Hosted',
                                text: 'Keep control of your data. Deploy anywhere you want.'
                            }
                        ]
                    }
                ]
            }
        };

        const landingRes = await fetch(`${STRAPI_URL}/api/landing-page`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(landingPageData)
        });

        if (landingRes.ok) {
            console.log('✅ Landing Page content seeded');

            // Publish Landing Page
            await fetch(`${STRAPI_URL}/api/landing-page?status=published`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ data: { ...landingPageData.data } })
            });
            console.log('✅ Landing Page content published');
        } else {
            const err = await landingRes.text();
            console.log('❌ Failed to seed Landing Page:', err);
        }
    } catch (e) {
        console.log('❌ Error seeding Landing Page:', e.message);
    }

    console.log('\n🎉 Seeding complete! Refresh http://localhost:3001 to see the changes.');
}

seedData();
