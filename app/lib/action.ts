"use server";

import { CurrentAction } from "../components/overlay/types";

/**
 * 목적지 계산
 * @param destination - 목적지 이름
 * @returns { instruction: string, currentAction: CurrentAction } - 안내 메시지와 현재 방향
 */
export async function calculateDestination(destination: string) {
  // 2초 대기
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const instruction: string = "복도 끝까지 직진하세요";
  const currentAction: CurrentAction = "front";

  return { instruction, currentAction };
}
