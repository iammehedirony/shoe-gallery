"use client";

import { useLoading } from "@/src/contexts/LoadingContext";
import SplashScreen from "./SplashScreen";

export default function SplashScreenWrapper() {
  const { isLoading, setIsLoading } = useLoading();

  if (!isLoading) return null;

  return <SplashScreen onLoadComplete={() => setIsLoading(false)} />;
}
