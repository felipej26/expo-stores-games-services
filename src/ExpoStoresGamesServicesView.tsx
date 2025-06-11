import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoStoresGamesServicesViewProps } from './ExpoStoresGamesServices.types';

const NativeView: React.ComponentType<ExpoStoresGamesServicesViewProps> =
  requireNativeView('ExpoStoresGamesServices');

export default function ExpoStoresGamesServicesView(props: ExpoStoresGamesServicesViewProps) {
  return <NativeView {...props} />;
}
