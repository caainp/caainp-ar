'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
// THREEx를 사용하기 위해 import 합니다. 
// Next.js SSR 문제 방지를 위해 useEffect 내부에서 require하거나 dynamic import를 쓸 수도 있지만, 
// 'use client' 환경에서는 아래와 같이 import 해도 대부분 작동합니다.
import { THREEx } from '@ar-js-org/ar.js-threejs';

export default function XRScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    // 1. Three.js 기본 설정 (Scene, Camera, Renderer)
    const scene = new THREE.Scene();
    
    // AR용 카메라는 나중에 ArToolkitContext가 제어하므로 초기값은 간단하게 잡습니다.
    const camera = new THREE.Camera();
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true // 배경을 투명하게 해서 카메라 영상이 보이게 함
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    renderer.domElement.style.left = '0px';
    
    // 생성한 렌더러를 DOM에 추가
    if (containerRef.current) {
      (containerRef.current as HTMLDivElement).appendChild(renderer.domElement as HTMLCanvasElement);
    }

    // 2. ArToolkitSource 설정 (웹캠 활성화)
    const arToolkitSource = new THREEx.ArToolkitSource({
      sourceType: 'webcam',
      // 모바일 등에서 비율 유지를 위해 sourceWidth/Height는 보통 기본값을 쓰거나 상황에 맞게 조절합니다.
      sourceWidth: window.innerWidth,
      sourceHeight: window.innerHeight,
    });

    const onResize = () => {
      arToolkitSource.onResizeElement();
      arToolkitSource.copyElementSizeTo(renderer.domElement);
      if (arToolkitContext.arController !== null) {
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
      }
    };

    arToolkitSource.init(() => {
      setTimeout(() => {
        onResize();
      }, 2000); // 초기화 딜레이를 주어 리사이즈 안정화
    }, () => {
      console.error('ArToolkitSource initialization failed');
    });

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener('resize', onResize);

    // 3. ArToolkitContext 설정 (카메라 파라미터 및 좌표계 처리)
    const arToolkitContext = new THREEx.ArToolkitContext({
      cameraParametersUrl: THREEx.ArToolkitContext.baseURL + '../data/data/camera_para.dat',
      detectionMode: 'mono',
    });

    arToolkitContext.init(() => {
      // 투영 행렬을 카메라에 복사
      camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });

    // 4. 간단한 3D 객체 추가 (테스트용 큐브)
    // AR 마커가 없어도 화면에 무언가 떠 있는지 확인하기 위해 카메라 앞에 큐브를 둡니다.
    // 실제 AR 마커를 쓰려면 ArMarkerControls를 추가해야 합니다.
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshNormalMaterial({
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
    }); 
    const cube = new THREE.Mesh(geometry, material);
    cube.position.z = -3; // 카메라 앞 3미터
    scene.add(cube);

    // 5. 렌더링 루프
    let animationFrameId: number;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (arToolkitSource.ready === false) return;

      // AR 컨텍스트 업데이트 (카메라 움직임 인식)
      arToolkitContext.update(arToolkitSource.domElement);

      // 씬 렌더링
      renderer.render(scene, camera);
    };

    animate();

    // 6. Cleanup (컴포넌트 해제 시)
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
      
      // 웹캠 스트림 정지
      if (arToolkitSource && arToolkitSource.domElement) {
         const stream = arToolkitSource.domElement.srcObject;
         if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach((track: MediaStreamTrack) => track.stop());
         }
         arToolkitSource.domElement.remove();
      }

      // DOM 정리
      if (containerRef.current && renderer.domElement) {
        (containerRef.current as HTMLDivElement).removeChild(renderer.domElement as HTMLCanvasElement);
      }
    };
  }, []);

  return (
    <div className='w-full h-full relative overflow-hidden'>
      {/* Three.js Canvas가 들어갈 컨테이너 */}
      <div ref={containerRef} className='w-full h-full' />
      
      {/* UI 오버레이 */}
      <div className='absolute top-0 left-0 w-full p-4 pointer-events-none'>
        <h1 className='text-white text-2xl font-bold'>XRScene Active</h1>
      </div>
    </div>
  );
}