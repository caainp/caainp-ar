export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get("destination");

  // 2초 대기
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const instruction = "복도 끝까지 직진하세요";
  const currentAction = "front";

  return Response.json({ destination, instruction, currentAction });
}
