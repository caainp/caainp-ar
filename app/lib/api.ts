import { MoveInstruction, RouteSummary } from "../components/overlay/types";

export interface NavigationStepResponse {
  schema_version: number;
  current_node: number;
  next_node: number;
  move_instruction: MoveInstruction;
  route_summary: RouteSummary;
}

export async function fetchNavigationStep(
  requestText: string,
  image: File
): Promise<NavigationStepResponse> {
  const formData = new FormData();
  formData.append("request_text", requestText);
  formData.append("image", image);

  const response = await fetch("/api/navigation/step", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
  }

  const data: NavigationStepResponse = await response.json();
  return data;
}