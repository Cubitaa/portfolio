/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly RESEND_API_KEY: string;
  readonly CONTACT_EMAIL_TO: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
