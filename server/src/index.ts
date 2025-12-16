import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    console.log('🚀 Strapi bootstrap started');
    console.log('✅ Strapi is ready - please register your admin at /admin');
  },
};
