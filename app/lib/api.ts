import { MoveInstruction, RouteSummary } from "../components/overlay/types";

export interface NavigationStartResponse {
  schema_version: number;
  current_node: number;
  next_node: number;
  move_instruction: MoveInstruction;
  route_summary: RouteSummary;
}

export interface NavigationStepResponse {
  schema_version: number;
  current_node: number;
  next_node: number;
  move_instruction: MoveInstruction;
  route_summary: RouteSummary;
}

export async function fetchNavigationStart(
  requestText: string,
  startRoom: string,
  image: File
): Promise<NavigationStartResponse> {
  const formData = new FormData();
  formData.append("request_text", requestText);
  formData.append("start_room", startRoom.toString());
  formData.append("image", image);

  const response = await fetch("/api/navigation/start", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: '알 수 없는 오류' }));
    throw new Error(errorData.details || errorData.error || `API 요청 실패: ${response.status} ${response.statusText}`);
  }

  const data: NavigationStartResponse = await response.json();
  return data;
}

export async function fetchNavigationStep(
  image: File
): Promise<NavigationStepResponse> {
  const formData = new FormData();
  formData.append("image", image);

  const response = await fetch("/api/navigation/step", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: '알 수 없는 오류' }));
    throw new Error(errorData.details || errorData.error || `API 요청 실패: ${response.status} ${response.statusText}`);
  }

  const data: NavigationStepResponse = await response.json();
  return data;
}
