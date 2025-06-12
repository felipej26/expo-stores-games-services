package expo.modules.storesgamesservices

import android.content.Context
import expo.modules.core.interfaces.ApplicationLifecycleListener
import expo.modules.core.interfaces.Package

class ExpoStoresGamesServicesPackage : Package {
  override fun createApplicationLifecycleListeners(context: Context): List<ApplicationLifecycleListener> {
    return listOf(ExpoStoresGamesServicesApplicationLifecycleListener())
  }
}