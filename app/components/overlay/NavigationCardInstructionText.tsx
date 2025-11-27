import { animate } from "animejs";
import { useEffect, useRef, useState } from "react";

export default function NavigationCardInstructionText({
  text_ko,
}: {
  text_ko: string;
}) {
  const [displayedText, setDisplayedText] = useState(text_ko);
  const textRef = useRef<HTMLParagraphElement>(null);
  const isInitialRenderRef = useRef(true);

  useEffect(() => {
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;
      return;
    }

    const element = textRef.current;
    if (!element) return;

    animate(element, {
      translateY: "-12px",
      opacity: 0,
      duration: 250,
      easing: "easeInQuad",
      onComplete: () => {
        setDisplayedText(text_ko);

        animate(element, {
          translateY: "12px",
          opacity: 0,
          duration: 0,
        });

        animate(element, {
          translateY: "0px",
          opacity: 1,
          duration: 350,
          easing: "easeOutExpo",
        });
      },
    });
  }, [text_ko]);

  return (
    <div className="overflow-hidden relative">
      <p
        ref={textRef}
        className="instruction-text text-base font-medium text-zinc-100 leading-snug origin-center"
      >
        {displayedText}
      </p>
    </div>
  );
}
