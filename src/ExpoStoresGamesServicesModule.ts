import { NativeModule, requireNativeModule } from 'expo';

import { ExpoStoresGamesServicesModuleEvents } from './ExpoStoresGamesServices.types';

declare class ExpoStoresGamesServicesModule extends NativeModule<ExpoStoresGamesServicesModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoStoresGamesServicesModule>('ExpoStoresGamesServices');
