'use client';

import { useCallback, useRef, useState } from "react";

type CaptureOptions = {
  /**
   * 캡처 직후 브라우저 다운로드를 트리거할지 여부
   */
  download?: boolean;
  /**
   * 다운로드 파일명 (download=true일 때만 사용)
   */
  filename?: string;
};

type CaptureResult = string | null;

/**
 * AR 씬을 캡처해 base64 PNG 데이터 URL을 반환하는 훅
 * - 기본값으로 다운로드도 수행하며, 서버 전송 시 download=false로 호출 가능
 */
export function useARScreenCapture() {
  const [isCapturing, setIsCapturing] = useState(false);
  const captureLockRef = useRef(false);

  const captureScreen = useCallback(
    async (options: CaptureOptions = {}): Promise<CaptureResult> => {
      if (captureLockRef.current) return null;
      captureLockRef.current = true;
      setIsCapturing(true);

      const { download = true, filename } = options;

      try {
        const sceneEl = document.querySelector("a-scene");
        const videoEl = document.querySelector("video");
        const canvasEl = sceneEl?.querySelector("canvas");

        if (!sceneEl || !videoEl || !canvasEl) {
          console.error("필요한 AR 요소를 찾을 수 없습니다.");
          return null;
        }

        const width = canvasEl.width;
        const height = canvasEl.height;

        const captureCanvas = document.createElement("canvas");
        captureCanvas.width = width;
        captureCanvas.height = height;
        const ctx = captureCanvas.getContext("2d");

        if (!ctx) {
          console.error("Canvas Context 생성 실패");
          return null;
        }

        const videoWidth = videoEl.videoWidth;
        const videoHeight = videoEl.videoHeight;

        const videoRatio = videoWidth / videoHeight;
        const canvasRatio = width / height;

        let sx = 0;
        let sy = 0;
        let sWidth = videoWidth;
        let sHeight = videoHeight;

        if (canvasRatio > videoRatio) {
          sWidth = videoWidth;
          sHeight = videoWidth / canvasRatio;
          sy = (videoHeight - sHeight) / 2;
        } else {
          sWidth = videoHeight * canvasRatio;
          sHeight = videoHeight;
          sx = (videoWidth - sWidth) / 2;
        }

        ctx.drawImage(videoEl, sx, sy, sWidth, sHeight, 0, 0, width, height);
        ctx.drawImage(canvasEl, 0, 0, width, height);

        const dataURL = captureCanvas.toDataURL("image/png");

        if (download) {
          const link = document.createElement("a");
          link.download = filename ?? `ar-capture-${Date.now()}.png`;
          link.href = dataURL;
          link.click();
        }

        return dataURL;
      } catch (error) {
        console.error("캡처 중 오류 발생:", error);
        return null;
      } finally {
        captureLockRef.current = false;
        setIsCapturing(false);
      }
    },
    []
  );

  return { captureScreen, isCapturing };
}


