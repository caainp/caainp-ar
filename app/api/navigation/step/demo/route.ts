import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const TOTAL_STEPS = 3;

const DEMO_STEPS = [
  {
    current_node: 1,
    next_node: 2,
    move_instruction: {
      direction_type: "STRAIGHT",
      angle_deg: 0,
      text_ko: "직진하여 인큐베이터로 이동하세요",
    },
    route_summary: {
      current_step: 1,
      total_steps: TOTAL_STEPS,
      remaining_steps_text: "인큐베이터로 이동 → 414호 강의실로 이동 → 도착",
      via_nodes: [1, 2, 3],
    },
  },
  {
    current_node: 2,
    next_node: 3,
    move_instruction: {
      direction_type: "TURN_BACK",
      angle_deg: 90,
      text_ko: "뒤로 돌아서 414호 강의실로 이동하세요",
    },
    route_summary: {
      current_step: 2,
      total_steps: TOTAL_STEPS,
      remaining_steps_text: "인큐베이터로 이동 → 414호 강의실로 이동 → 도착",
      via_nodes: [1, 2, 3],
    },
  },
  {
    current_node: 3,
    next_node: 3,
    move_instruction: {
      direction_type: "LEFT",
      angle_deg: -90,
      text_ko: "왼쪽으로 돌아서 414호 강의실로 이동하세요",
    },  
    route_summary: {
      current_step: 2,
      total_steps: TOTAL_STEPS,
      remaining_steps_text: "인큐베이터로 이동 → 414호 강의실로 이동 → 도착",
      via_nodes: [1, 2, 3],
    },
  },
  {
    current_node: 3,
    next_node: 3,
    move_instruction: {
      direction_type: "STRAIGHT",
      angle_deg: 0,
      text_ko: "직진하여 414호 강의실로 이동하세요",
    },  
    route_summary: {
      current_step: 2,
      total_steps: TOTAL_STEPS,
      remaining_steps_text: "인큐베이터로 이동 → 414호 강의실로 이동 → 도착",
      via_nodes: [1, 2, 3],
    },
  },
  {
    current_node: 3,
    next_node: null,
    move_instruction: {
      direction_type: "STRAIGHT",
      angle_deg: 0,
      text_ko: "목적지 414호 강의실에 도착했습니다",
    },
    route_summary: {
      current_step: 3,
      total_steps: TOTAL_STEPS,
      remaining_steps_text: "인큐베이터로 이동 → 414호 강의실로 이동 → 도착",
      via_nodes: [1, 2, 3],
    },
  },
];

export async function POST() {
  const cookieStore = await cookies();
  const currentStepStr = cookieStore.get("demo_step")?.value;
  let currentStep = currentStepStr ? parseInt(currentStepStr, 10) : 0;

  currentStep = Math.min(currentStep + 1, DEMO_STEPS.length - 1);

  const stepData = DEMO_STEPS[currentStep];

  const response = NextResponse.json({
    schema_version: 1,
    ...stepData,
  });

  response.cookies.set("demo_step", currentStep.toString(), {
    path: "/",
    maxAge: 60 * 60, // 1시간
  });

  await new Promise((resolve) => setTimeout(resolve, 500));

  return response;
}

