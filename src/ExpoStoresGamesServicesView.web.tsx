import * as React from 'react';

import { ExpoStoresGamesServicesViewProps } from './ExpoStoresGamesServices.types';

export default function ExpoStoresGamesServicesView(props: ExpoStoresGamesServicesViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
