import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   * 
   * Seeds mock data and creates default admin on first run.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // ============================================
    // AUTO-CREATE SUPERADMIN ON FIRST STARTUP
    // ============================================
    try {
      const adminService = strapi.service('admin::user');
      const adminCount = await strapi.query('admin::user').count();

      if (adminCount === 0) {
        console.log('👤 Creating default superadmin user...');

        const superAdminRole = await strapi.query('admin::role').findOne({
          where: { code: 'strapi-super-admin' }
        });

        if (superAdminRole) {
          await adminService.create({
            firstname: 'Rahul',
            lastname: 'Sinha',
            email: 'rahul.sinha@acumen-strategy.com',
            password: 'Springercapital@123',
            isActive: true,
            roles: [superAdminRole.id]
          });
          console.log('✅ Superadmin created: rahul.sinha@acumen-strategy.com');
        }
      } else {
        console.log('ℹ️ Admin user already exists, skipping creation');
      }
    } catch (err) {
      console.log('⚠️ Could not create superadmin:', err);
    }

    // Check if Global content already has data
    const existingGlobal = await strapi.documents('api::global.global').findFirst({});

    if (!existingGlobal || !(existingGlobal as any).topNav) {
      console.log('🌱 Seeding Global content...');

      // Create or update Global content
      await strapi.documents('api::global.global').create({
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
        },
        status: 'published'
      });

      console.log('✅ Global content seeded');
    }

    // Check if Landing Page content already has data
    const existingLandingPage = await strapi.documents('api::landing-page.landing-page').findFirst({});

    if (!existingLandingPage || !(existingLandingPage as any).blocks || (existingLandingPage as any).blocks.length === 0) {
      console.log('🌱 Seeding Landing Page content...');

      await strapi.documents('api::landing-page.landing-page').create({
        data: {
          title: 'Welcome to Our Site',
          description: 'Discover amazing content and features',
          blocks: [
            {
              __component: 'layout.hero',
              heading: 'Build Amazing Websites with Strapi',
              text: "Strapi is the leading open-source headless CMS. It's 100% JavaScript/TypeScript, fully customizable, and developer-first.",
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
        },
        status: 'published'
      });

      console.log('✅ Landing Page content seeded');
    }

    // Set up public permissions for API access
    console.log('🔐 Setting up public permissions...');
    try {
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' }
      });

      if (publicRole) {
        // Get all permissions for the public role
        const permissions = await strapi.query('plugin::users-permissions.permission').findMany({
          where: { role: publicRole.id }
        });

        // Define the actions we want to enable for public access
        const actionsToEnable = [
          'api::global.global.find',
          'api::landing-page.landing-page.find',
          'api::page.page.find',
          'api::page.page.findOne',
          'api::post.post.find',
          'api::post.post.findOne',
          'api::category.category.find',
          'api::category.category.findOne'
        ];

        for (const action of actionsToEnable) {
          const existingPermission = permissions.find((p: any) => p.action === action);

          if (!existingPermission) {
            // Create the permission if it doesn't exist
            await strapi.query('plugin::users-permissions.permission').create({
              data: {
                action,
                role: publicRole.id
              }
            });
          }
        }
        console.log('✅ Public permissions configured');
      }
    } catch (err) {
      console.log('⚠️ Could not set public permissions:', err);
    }

    console.log('🚀 Bootstrap complete!');
  },
};
