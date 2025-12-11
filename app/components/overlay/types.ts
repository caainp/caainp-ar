export type DirectionType =
  | "STRAIGHT"
  | "LEFT"
  | "RIGHT"
  | "TURN_BACK"
  | "STAIRS_UP"
  | "STAIRS_DOWN";

export interface MoveInstruction {
  direction_type: DirectionType;
  angle_deg: number;
  text_ko: string;
}

export interface RouteSummary {
  current_step: number;
  total_steps: number;
  remaining_steps_text: string;
  via_nodes: number[];
}

export interface NavData {
  schema_version: number;
  current_node: number | null;
  next_node: number | null;
  move_instruction: MoveInstruction;
  route_summary: RouteSummary;
  destination: string | null;
}

export type DemoPhase = "idle" | "intro" | "searching" | "navigating" | "completed";

export interface DemoData {
  enableDemoMode: boolean;
  isPanelOpen: boolean;
  isPlaying: boolean;
  phase: DemoPhase;
  currentScenarioStep: number;
}
