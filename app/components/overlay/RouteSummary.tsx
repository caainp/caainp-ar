"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  memo,
} from "react";
import { animate, createScope, stagger } from "animejs";
import RouteStep from "./RouteStep";
import { Dot, ChevronDown } from "lucide-react";
import { useOverlayContext } from "./OverlayContext";

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
      duration: 300,
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
      duration: 400,
      staggerDelay: 100,
      staggerStart: 200,
      ease: "outExpo",
      // translateX: [-20, 0] as [number, number],
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
    delay: any;
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep = useMemo(() => {
    return routeSummary.current_step;
  }, [routeSummary.current_step]);

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
      opacity: [0, 1],
      duration: config.container.duration,
      ease: config.container.ease,
      complete: () => {
        resetContainerStyles(container);
        setIsAnimating(false);
      },
    });

    // 단계 아이템 애니메이션
    animateStepItems(".step-item", {
      opacity: [0, 1],
      scale: config.stepItems.scale,
      duration: config.stepItems.duration,
      delay: stagger(config.stepItems.staggerDelay, { start: 0 }),
      ease: config.stepItems.ease,
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

    // 단계 아이템 페이드 아웃
    animateStepItems(".step-item", {
      opacity: [1, 0],
      translateY: config.stepItems.translateY,
      scale: config.stepItems.scale,
      duration: config.stepItems.duration,
      delay: stagger(config.stepItems.staggerDelay, { from: "last" }),
      ease: config.stepItems.ease,
    });

    // 접기 애니메이션
    const foldDelay = Math.min(
      totalSteps * config.delayMultiplier,
      config.maxDelay
    );

    animate(container, {
      height: [`${height}px`, 0],
      marginTop: [ANIMATION_CONFIG.SPREAD.container.marginTop, "0px"],
      paddingTop: [ANIMATION_CONFIG.SPREAD.container.paddingTop, "0px"],
      opacity: [1, 0],
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
    // 사용자가 수동으로 펼친 상태였다면 자동 접기 타이머를 설정하지 않음
    if (isManuallySpreadRef.current) {
      clearTimer();
      return;
    }

    clearTimer();
    handleSpread(true, false);
    isManuallySpreadRef.current = false;

    timerRef.current = setTimeout(() => {
      clearTimer();
      handleSpread(false, false);
    }, AUTO_FOLD_DELAY);

    return clearTimer;
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
  }, [currentStep, isSpread]);

  useEffect(() => {
    return scrollToCurrentStep();
  }, [scrollToCurrentStep]);

  // 단계 데이터 파싱
  const steps = routeSummary.remaining_steps_text.split(" → ");
  const currentStepText = steps[currentStep - 1] || "";

  const handleToggleSpread = useCallback(() => {
    handleSpread(!isSpread, true);
  }, [isSpread, handleSpread]);

  if (isLoading) {
    return <div ref={rootRef} className="route-container w-full"></div>;
  }

  return (
    <div
      ref={rootRef}
      className="route-container w-full px-4 py-3 cursor-pointer select-none border-t border-zinc-800"
      onClick={handleToggleSpread}
    >
      {/* 진행률 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            경로
          </span>
          <span className="text-xs text-zinc-600">
            {routeSummary.current_step} / {routeSummary.total_steps}
          </span>
          <div
            ref={collapsedInfoRef}
            className="collapsed-info flex items-center gap-1"
          >
            <span>
              <Dot size={10} className="text-zinc-600" />
            </span>
            <span className="text-xs font-medium text-zinc-300">
              {currentStepText}
            </span>
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`text-zinc-500 transition-transform ${
            isSpread ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* 경로 단계들 */}
      <div
        ref={stepsContainerRef}
        className="steps-container space-y-1 pt-4 flex flex-col overflow-y-auto max-h-36 h-0"
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
