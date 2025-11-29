"use client";

import React, { useEffect, useRef, useState, useCallback, memo, TouchEvent } from "react";
import { animate, createScope, stagger, TweenParamValue } from "animejs";
import RouteStep from "./RouteStep";
import RouteSummaryHeader from "./RouteSummaryHeader";
import { useOverlayContext } from "./OverlayContext";

const SWIPE_THRESHOLD = 30;

// 애니메이션 상수
const ANIMATION_CONFIG = {
  SPREAD: {
    container: {
      duration: 450,
      ease: "outExpo",
      marginTop: "8px",
      paddingTop: "8px",
    },
    stepItems: {
      duration: 400,
      staggerDelay: 50,
      ease: "outExpo",
      scale: [1, 1] as [number, number],
    },
  },
  FOLD: {
    container: {
      duration: 450,
      ease: "outExpo",
    },
    stepItems: {
      duration: 200,
      staggerDelay: 30,
      ease: "outExpo",
      translateY: [0, 0] as [number, number],
      scale: [1, 1] as [number, number],
    },
    collapsedInfo: {
      duration: 350,
      ease: "outExpo",
      delayOffset: 200,
    },
    maxDelay: 150,
    delayMultiplier: 50,
  },
  FADE_IN: {
    container: {
      duration: 500,
      ease: "outExpo",
      translateY: [20, 0] as [number, number],
    },
    stepItems: {
      duration: 300,
      staggerDelay: 50,
      staggerStart: 0,
      ease: "outExpo",
    },
    progressBar: {
      duration: 800,
      delay: 400,
      ease: "outExpo",
    },
  },
  LOADING: {
    duration: 1500,
    ease: "outExpo",
  },
};

const AUTO_FOLD_DELAY = 2000;

// 애니메이션 헬퍼 함수들
const applyContainerStyles = (
  container: HTMLElement,
  styles: Partial<CSSStyleDeclaration>
) => {
  Object.assign(container.style, styles);
};

const resetContainerStyles = (container: HTMLElement) => {
  applyContainerStyles(container, {
    marginTop: ANIMATION_CONFIG.SPREAD.container.marginTop,
    paddingTop: ANIMATION_CONFIG.SPREAD.container.paddingTop,
  });
};

const animateStepItems = (
  selector: string,
  config: {
    opacity: [number, number];
    scale?: [number, number];
    translateY?: [number, number];
    translateX?: [number, number];
    duration: number;
    delay: TweenParamValue;
    ease: string;
  }
) => {
  animate(selector, {
    opacity: config.opacity,
    ...(config.scale && { scale: config.scale }),
    ...(config.translateY && { translateY: config.translateY }),
    ...(config.translateX && { translateX: config.translateX }),
    duration: config.duration,
    delay: config.delay,
    ease: config.ease,
  });
};

function RouteSummary() {
  const { navData, isLoadingDestination } = useOverlayContext();
  const routeSummary = navData.route_summary;
  const isLoading = isLoadingDestination;
  const rootRef = useRef<HTMLDivElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);
  const collapsedInfoRef = useRef<HTMLDivElement>(null);

  const [isSpread, setIsSpread] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const isManuallySpreadRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentStep = routeSummary.current_step;

  // 타이머 관리 헬퍼
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const spreadSteps = useCallback(() => {
    if (!stepsContainerRef.current || !collapsedInfoRef.current || isAnimating)
      return;

    setIsAnimating(true);

    const container = stepsContainerRef.current;
    const collapsedInfo = collapsedInfoRef.current;

    // 초기 상태 설정
    applyContainerStyles(container, {
      display: "flex",
      height: "0px",
    });
    collapsedInfo.style.opacity = "0";

    const height = container.scrollHeight;
    const config = ANIMATION_CONFIG.SPREAD;

    // 컨테이너 펼치기 애니메이션
    animate(container, {
      height: [0, height],
      marginTop: ["0px", config.container.marginTop],
      paddingTop: ["0px", config.container.paddingTop],
      duration: config.container.duration,
      ease: config.container.ease,
      complete: () => {
        resetContainerStyles(container);
        setIsAnimating(false);
      },
    });
  }, [isAnimating]);

  const foldSteps = useCallback(() => {
    if (!stepsContainerRef.current || isAnimating) return;

    setIsAnimating(true);

    const container = stepsContainerRef.current;
    const height = container.scrollHeight;
    const config = ANIMATION_CONFIG.FOLD;

    applyContainerStyles(container, {
      height: `${height}px`,
    });

    const stepItems = container.querySelectorAll(".step-item");
    const totalSteps = stepItems.length;

    // 접기 애니메이션
    const foldDelay = Math.min(
      totalSteps * config.delayMultiplier,
      config.maxDelay
    );

    animate(container, {
      height: [`${height}px`, 0],
      marginTop: [ANIMATION_CONFIG.SPREAD.container.marginTop, "0px"],
      paddingTop: [ANIMATION_CONFIG.SPREAD.container.paddingTop, "0px"],
      duration: config.container.duration,
      ease: config.container.ease,
      complete: () => {
        applyContainerStyles(container, {
          height: "0px",
          marginTop: "0px",
          paddingTop: "0px",
        });
        setIsAnimating(false);
      },
    });

    // 접힌 정보 표시 애니메이션
    setTimeout(() => {
      animate(".collapsed-info", {
        opacity: [0, 1],
        scale: [0.95, 1],
        duration: config.collapsedInfo.duration,
        ease: config.collapsedInfo.ease,
      });
    }, foldDelay + config.collapsedInfo.delayOffset);
  }, [isAnimating]);

  const handleSpread = useCallback(
    (spread: boolean, isManual: boolean = false) => {
      if (isAnimating) return; // 애니메이팅 상태에서 금지

      setIsSpread((prev) => {
        if (prev === spread) return prev;

        if (spread) {
          spreadSteps();
        } else {
          foldSteps();
        }

        return spread;
      });

      if (isManual) {
        isManuallySpreadRef.current = spread;
      }
    },
    [isAnimating, spreadSteps, foldSteps]
  );

  // currentStep 변경 시 자동 펼침/접기 처리
  useEffect(() => {
    if (isManuallySpreadRef.current) {
      clearTimer();
      return;
    }

    clearTimer();

    let animationFrameId: number | null = null;

    animationFrameId = requestAnimationFrame(() => {
      handleSpread(true, false);
      isManuallySpreadRef.current = false;

      timerRef.current = setTimeout(() => {
        clearTimer();
        handleSpread(false, false);
      }, AUTO_FOLD_DELAY);
    });

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      clearTimer();
    };
  }, [currentStep, handleSpread, clearTimer]);

  // 애니메이션 스코프 초기화
  useEffect(() => {
    scopeRef.current = createScope({ root: rootRef }).add((self) => {
      if (!self) return;

      const fadeInConfig = ANIMATION_CONFIG.FADE_IN;

      // 초기 페이드인 애니메이션
      self.add("fadeIn", () => {
        animate(".route-container", {
          opacity: [0, 1],
          translateY: fadeInConfig.container.translateY,
          duration: fadeInConfig.container.duration,
          ease: fadeInConfig.container.ease,
        });

        animateStepItems(".step-item", {
          opacity: [0, 1],
          duration: fadeInConfig.stepItems.duration,
          delay: stagger(fadeInConfig.stepItems.staggerDelay, {
            start: fadeInConfig.stepItems.staggerStart,
          }),
          ease: fadeInConfig.stepItems.ease,
        });
      });

      // 로딩 애니메이션
      self.add("startLoading", () => {
        animate(".loading-shimmer", {
          translateX: ["-100%", "100%"],
          duration: ANIMATION_CONFIG.LOADING.duration,
          loop: true,
          ease: ANIMATION_CONFIG.LOADING.ease,
        });
      });
    });

    return () => scopeRef.current?.revert();
  }, []);

  // 로딩 상태에 따른 애니메이션 실행
  useEffect(() => {
    if (!scopeRef.current) return;

    if (isLoading) {
      scopeRef.current.methods.startLoading();
    } else {
      scopeRef.current.methods.fadeIn();
    }
  }, [isLoading]);

  // 현재 단계로 스크롤 이동
  const scrollToCurrentStep = useCallback(() => {
    if (!stepsContainerRef.current || !isSpread) return;

    const currentStepIndex = routeSummary.current_step - 1;
    const container = stepsContainerRef.current;
    const stepItems = container.querySelectorAll(".step-item");
    const currentStepElement = stepItems[currentStepIndex] as HTMLElement;

    if (!currentStepElement) return;

    // 애니메이션 완료 후 스크롤 이동
    const scrollTimer = setTimeout(() => {
      const containerRect = container.getBoundingClientRect();
      const elementRect = currentStepElement.getBoundingClientRect();
      const scrollTop =
        container.scrollTop +
        (elementRect.top - containerRect.top) -
        containerRect.height / 2 +
        elementRect.height / 2;

      container.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      });
    }, 0);

    return () => clearTimeout(scrollTimer);
  }, [routeSummary.current_step, isSpread]);

  
  useEffect(() => {
    return scrollToCurrentStep();
  }, [scrollToCurrentStep]);

  // 단계 데이터 파싱
  const steps = routeSummary.remaining_steps_text.split(" → ");
  const currentStepText = steps[currentStep - 1] || "";

  const handleToggleSpread = useCallback(() => {
    handleSpread(!isSpread, true);
  }, [isSpread, handleSpread]);

  // 스와이프 제스처 처리
  const touchStartY = useRef<number | null>(null);
  
  const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent<HTMLDivElement>) => {
    if (touchStartY.current === null) return;
    
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    
    if (Math.abs(deltaY) > SWIPE_THRESHOLD) {
      // 위로 스와이프 = 펼치기, 아래로 스와이프 = 접기
      const shouldSpread = deltaY > 0;
      if (shouldSpread !== isSpread) {
        handleSpread(shouldSpread, true);
        // 햅틱 피드백 (지원하는 기기에서)
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      }
    }
    
    touchStartY.current = null;
  }, [isSpread, handleSpread]);

  if (isLoading) {
    return <div ref={rootRef} className="route-container w-full"></div>;
  }

  return (
    <div
      ref={rootRef}
      className="route-container w-full px-5 pt-4 pb-3 select-none safe-bottom
        bg-(--bg-bottom-card) rounded-t-3xl ring-1 ring-(--bg-secondary)/70
        touch-feedback grabbable shadow-lg shadow-black/20
      "
      onClick={handleToggleSpread}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 드래그 핸들 힌트 */}
      <div className="flex justify-center mb-3">
        <div 
          className={`w-10 h-1 rounded-full bg-(--text-disabled) transition-all duration-300 ${
            !isSpread ? 'swipe-hint' : 'opacity-50'
          }`}
        />
      </div>

      {/* 헤더 */}
      <RouteSummaryHeader
        collapsedInfoRef={collapsedInfoRef}
        currentStep={routeSummary.current_step}
        currentStepText={currentStepText}
        isSpread={isSpread}
        totalSteps={routeSummary.total_steps}
      />

      {/* 경로 단계들 - Stepper UI */}
      <div
        ref={stepsContainerRef}
        className="steps-container pt-4 px-2 flex flex-col overflow-y-auto 
          max-h-52 h-0 scrollbar-hide overscroll-contain"
      >
        {steps.map((step, index) => {
          const isCompleted = index < routeSummary.current_step - 1;
          const isCurrent = index === routeSummary.current_step - 1;
          const isLast = index === steps.length - 1;

          return (
            <RouteStep
              key={index}
              step={step}
              index={index}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              isLast={isLast}
            />
          );
        })}
      </div>
    </div>
  );
}

export default memo(RouteSummary);
