package expo.modules.storesgamesservices

import android.app.Application
import expo.modules.core.interfaces.ApplicationLifecycleListener
import com.google.android.gms.games.PlayGamesSdk;

class ExpoStoresGamesServicesApplicationLifecycleListener : ApplicationLifecycleListener {
  override fun onCreate(application: Application) {
    PlayGamesSdk.initialize(application);
  }
}