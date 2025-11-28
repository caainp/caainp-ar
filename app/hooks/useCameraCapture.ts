"use client";

import { useCallback, useRef, useState } from "react";
import { useCameraContext } from "@/app/components/Camera";

type CaptureOptions = {
  /**
   * 캡처 직후 브라우저 다운로드를 트리거할지 여부
   */
  download?: boolean;
  /**
   * 다운로드 파일명
   */
  filename?: string;
};

type CaptureResult = string | null;

/**
 * Webcam을 캡처해 base64 JPEG 데이터 URL을 반환하는 훅
 * - 기본값으로 다운로드도 수행하며, 서버 전송 시 download=false로 호출 가능
 */
export function useCameraCapture() {
  const [isCapturing, setIsCapturing] = useState(false);
  const captureLockRef = useRef(false);
  const { webcamRef } = useCameraContext();

  const captureScreen = useCallback(
    async (options: CaptureOptions = {}): Promise<CaptureResult> => {
      if (captureLockRef.current) return null;
      captureLockRef.current = true;
      setIsCapturing(true);

      const { download = true, filename } = options;

      try {
        if (!webcamRef || !webcamRef.current) {
          console.error("Webcam ref를 찾을 수 없습니다.");
          return null;
        }

        const imageSrc = webcamRef.current.getScreenshot();

        if (!imageSrc) {
          console.error("스크린샷을 생성할 수 없습니다.");
          return null;
        }

        if (download) {
          const link = document.createElement("a");
          link.download = filename ?? `camera-capture-${Date.now()}.jpg`;
          link.href = imageSrc;
          link.click();
        }

        return imageSrc;
      } catch (error) {
        console.error("캡처 중 오류 발생:", error);
        return null;
      } finally {
        captureLockRef.current = false;
        setIsCapturing(false);
      }
    },
    [webcamRef]
  );

  return { captureScreen, isCapturing };
}
