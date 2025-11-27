"use server";

import { DirectionType, NavData } from "../components/overlay/types";

/**
 * 목적지 계산
 * @param formData - 목적지/이미지를 담은 FormData
 * @returns NavData - 네비게이션 데이터
 */
export async function calculateDestination(
  formData: FormData
): Promise<NavData> {
  const destination = formData.get("destination");
  if (!destination || typeof destination !== "string") {
    throw new Error("destination is required");
  }

  const captureFile = formData.get("captureImage");
  if (captureFile && captureFile instanceof File) {
    const arrayBuffer = await captureFile.arrayBuffer();
    console.log(
      "첨부된 캡처 이미지 바이트:",
      arrayBuffer.byteLength,
      captureFile.type
    );
  }

  // 2초 대기 (서버 응답 시뮬레이션)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 예시 응답 데이터
  const navData: NavData = {
    schema_version: 1,
    current_node: 4106,
    next_node: 4103,
    move_instruction: {
      direction_type: "TURN_BACK" as DirectionType,
      angle_deg: 30.0,
      text_ko: "오른쪽 복도로 이동하세요.",
    },
    route_summary: {
      current_step: 1,
      total_steps: 5,
      remaining_steps_text:
        "이동 경로 테스트 → 이동 경로 테스트 2 → 이동 경로 테스트 3 → 이동 경로 테스트 4 → 이동 경로 테스트 5",
      via_nodes: [1, 2, 3, 4, 5],
    },
    destination,
  };

  return navData;
}
