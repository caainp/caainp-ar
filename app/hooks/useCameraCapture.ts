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
  /**
   * 반환 형식 (base64 string 또는 Blob)
   * @default 'base64'
   */
  format?: "base64" | "blob";
  /**
   * 리사이징할 너비
   */
  width?: number;
  /**
   * JPEG 품질 (0~1)
   * @default 0.8
   */
  quality?: number;
};

type CaptureResult = string | Blob | null;

/**
 * Webcam을 캡처해 base64 JPEG 데이터 URL 또는 Blob을 반환하는 훅
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

      const {
        download = true,
        filename,
        format = "base64",
        width: targetWidth,
        quality = 0.8,
      } = options;

      try {
        if (!webcamRef || !webcamRef.current) {
          console.error("Webcam ref를 찾을 수 없습니다.");
          return null;
        }

        // 기본 스크린샷
        const imageSrc = webcamRef.current.getScreenshot();

        if (!imageSrc) {
          console.error("스크린샷을 생성할 수 없습니다.");
          return null;
        }

        // 리사이징 또는 Blob 변환이 필요한 경우 Canvas 사용
        let result: CaptureResult = imageSrc;

        if (targetWidth || format === "blob") {
          result = await new Promise<CaptureResult>((resolve) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");
              
              const scale = targetWidth ? targetWidth / img.width : 1;
              canvas.width = img.width * scale;
              canvas.height = img.height * scale;

              if (ctx) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                if (format === "blob") {
                  canvas.toBlob(
                    (blob) => resolve(blob),
                    "image/jpeg",
                    quality
                  );
                } else {
                  resolve(canvas.toDataURL("image/jpeg", quality));
                }
              } else {
                resolve(null);
              }
            };
            img.src = imageSrc;
          });
        }

        if (!result) return null;

        // 다운로드 처리
        if (download) {
          const link = document.createElement("a");
          link.download = filename ?? `camera-capture-${Date.now()}.jpg`;
          
          if (result instanceof Blob) {
            link.href = URL.createObjectURL(result);
          } else {
            link.href = result as string;
          }
          
          link.click();
          
          if (result instanceof Blob) {
            URL.revokeObjectURL(link.href);
          }
        }

        return result;
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
