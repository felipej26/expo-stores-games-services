// Reexport the native module. On web, it will be resolved to ExpoStoresGamesServicesModule.web.ts
// and on native platforms to ExpoStoresGamesServicesModule.ts
export { default } from './ExpoStoresGamesServicesModule';
export { default as ExpoStoresGamesServicesView } from './ExpoStoresGamesServicesView';
export * from  './ExpoStoresGamesServices.types';
