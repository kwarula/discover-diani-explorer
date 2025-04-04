
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  readonly VITE_OPENWEATHER_API_KEY: string;
  readonly VITE_STORMGLASS_API_KEY: string;
  readonly VITE_WORLD_TIDES_API_KEY: string;
  readonly [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
