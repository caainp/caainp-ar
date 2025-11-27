export type CurrentAction = "front" | "left" | "right" | "back";

export interface NavData {
  currentAction: CurrentAction;
  distance: number;
  instruction: string;
  nextWaypoint: string | null;
  totalSteps: number;
  currentStepIndex: number;
  destination: string | null;
  activeConstraints: string[];
}
