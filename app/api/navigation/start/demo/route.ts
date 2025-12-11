import { NextResponse } from "next/server";

export async function POST() {
  const demoResponse = {
    schema_version: 1,
    current_node: 1,
    next_node: 2,
    move_instruction: {
      direction_type: "STRAIGHT",
      angle_deg: 0,
      text_ko: "직진하여 인큐베이터로 이동하세요",
    },
    route_summary: {
      current_step: 1,
      total_steps: 3,
      remaining_steps_text: "인큐베이터로 이동 → 414호 강의실로 이동 → 도착",
      via_nodes: [1, 2, 3],
    },
  };

  const response = NextResponse.json(demoResponse);

  response.cookies.set("demo_step", "0", {
    path: "/",
    maxAge: 60 * 60,
  });

  await new Promise((resolve) => setTimeout(resolve, 500));

  return response;
}

