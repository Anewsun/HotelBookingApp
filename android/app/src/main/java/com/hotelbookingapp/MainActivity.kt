package com.hotelbookingapp

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "HotelBookingApp"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [RNGestureHandlerEnabledRootView]
   * to enable gesture handler in the root view.
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      object : ReactActivityDelegate(this, mainComponentName) {
          override fun createRootView(): RNGestureHandlerEnabledRootView {
              return RNGestureHandlerEnabledRootView(this@MainActivity)
          }
      }
}
