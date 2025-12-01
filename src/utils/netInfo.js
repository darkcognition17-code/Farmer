// useNetInfo.ts
import React, { useState, useEffect } from "react";
import { LayoutAnimation, Platform, UIManager } from "react-native";
import NetInfo from "@react-native-community/netinfo";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// 👇 global variables
let globalConnection = true;
let globalListeners: ((connected: boolean) => void)[] = [];

// export helpers for ApiClient
export const getGlobalConnection = () => globalConnection;

export const subscribeToNetInfo = (cb: (connected: boolean) => void) => {
  globalListeners.push(cb);
  return () => {
    globalListeners = globalListeners.filter((fn) => fn !== cb);
  };
};

const useNetInfo = () => {
  const [netConnected, setNetConnected] = useState(true);
  const [toggleNetState, setToggle] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = !!state.isConnected;
      globalConnection = connected; // ✅ update global state
      setNetConnected(connected);

      setTimeout(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setToggle(!connected);
      }, 1000);

      // notify global listeners
      globalListeners.forEach((cb) => cb(connected));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return [netConnected, toggleNetState];
};

export default useNetInfo;
