"use client";

import {
  useRef,
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useEffect,
  Activity,
} from "react";
import Webcam from "react-webcam";
import CameraOffBackground from "./CameraOffBackground";

type WebcamRef = Webcam | null;

type CameraContextType = {
  webcamRef: React.RefObject<WebcamRef>;
  isWebcamEnabled: boolean;
  hasCameraPermission: boolean;
  toggleWebcam: () => void;
  enableWebcam: () => void;
  disableWebcam: () => void;
};

const CameraContext = createContext<CameraContextType | null>(null);

export const useCameraContext = () => {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error("useCameraContext must be used within Camera component");
  }
  return context;
};

export default function Camera({ children }: { children?: ReactNode }) {
  const webcamRef = useRef<WebcamRef>(null);
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState(true);

  // 카메라 권한 확인
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        if (navigator.permissions && isWebcamEnabled) {
          const permissionStatus = await navigator.permissions.query({
            name: "camera" as PermissionName,
          });
          setHasCameraPermission(permissionStatus.state !== "denied");

          permissionStatus.onchange = () => {
            setHasCameraPermission(permissionStatus.state !== "denied");
          };
        }
      } catch (error) {
        // permissions API를 지원하지 않는 브라우저의 경우
        // onUserMediaError에서 처리
        alert(
          "카메라 권한이 필요합니다. 브라우저 설정에서 카메라 권한을 허용해주세요."
        );
        console.warn("카메라 권한 확인 실패:", error);
      }
    };

    checkCameraPermission();
  }, [isWebcamEnabled]);

  const handleUserMedia = useCallback(() => {
    setHasCameraPermission(true);
  }, []);

  const handleUserMediaError = useCallback((error: string | DOMException) => {
    console.error("카메라 접근 오류:", error);
    setHasCameraPermission(false);
    alert(
      "카메라 권한이 필요합니다. 브라우저 설정에서 카메라 권한을 허용해주세요."
    );
    setIsWebcamEnabled(false);
  }, []);

  const toggleWebcam = useCallback(() => {
    setIsWebcamEnabled((prev) => !prev);
  }, []);

  const enableWebcam = useCallback(() => {
    setIsWebcamEnabled(true);
  }, []);

  const disableWebcam = useCallback(() => {
    setIsWebcamEnabled(false);
  }, []);

  const shouldShowCamera = isWebcamEnabled && hasCameraPermission;

  return (
    <CameraContext.Provider
      value={{
        webcamRef,
        isWebcamEnabled,
        hasCameraPermission,
        toggleWebcam,
        enableWebcam,
        disableWebcam,
      }}
    >
      {shouldShowCamera && (
        <Webcam
          ref={webcamRef}
          audio={false}
          height={1080}
          width={1920}
          style={{
            width: "100%",
            height: "100%",
            zIndex: 1,
            objectFit: "cover",
          }}
          videoConstraints={{
            width: 1920,
            height: 1080,
            facingMode: "environment",
          }}
          screenshotFormat="image/jpeg"
          onUserMedia={handleUserMedia}
          onUserMediaError={handleUserMediaError}
        />
      )}

      <Activity mode={shouldShowCamera ? "hidden" : "visible"}>
        <CameraOffBackground />
      </Activity>
      {children}
    </CameraContext.Provider>
  );
}
