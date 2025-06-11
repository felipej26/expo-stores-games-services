import { registerWebModule, NativeModule } from 'expo';

import { ExpoStoresGamesServicesModuleEvents } from './ExpoStoresGamesServices.types';

class ExpoStoresGamesServicesModule extends NativeModule<ExpoStoresGamesServicesModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoStoresGamesServicesModule, 'ExpoStoresGamesServicesModule');
