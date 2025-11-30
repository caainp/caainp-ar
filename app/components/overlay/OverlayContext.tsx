"use client";

import { createContext, useContext, Dispatch, SetStateAction } from "react";
import { NavData } from "./types";

export interface OverlayContextValue {
  navData: NavData;
  setNavData: Dispatch<SetStateAction<NavData>>;
  isLoadingDestination: boolean;
  setIsLoadingDestination: Dispatch<SetStateAction<boolean>>;
  recentDestinations: string[];
  setRecentDestinations: Dispatch<SetStateAction<string[]>>;
  handleSelectDestination: (destination: string) => Promise<void>;
  handleCancelDestination: () => void;
  handleRemoveRecentDestination: (destination: string) => void;
  handleRemoveAllRecentDestinations: () => void;
  handleStepChange: (newStep: number) => void;
  handleDebugCapture: (captureImage: string | Blob) => Promise<void>;
  setting: boolean;
  setSetting: Dispatch<SetStateAction<boolean>>;
  debug: boolean;
  setDebug: Dispatch<SetStateAction<boolean>>;
  handleDebugUpdateNav: () => Promise<void>;
  palette: string;
  setPalette: Dispatch<SetStateAction<string>>;
}

const OverlayContext = createContext<OverlayContextValue | undefined>(
  undefined
);

export const OverlayProvider = OverlayContext.Provider;

export const useOverlayContext = () => {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error(
      "OverlayContext를 OverlayProvider 내에서만 사용할 수 있습니다."
    );
  }
  return context;
};
