import { NextResponse } from "next/server";

const EXTERNAL_API_URL = "https://windopper-caainp-backend.hf.space";

export async function POST(request: Request) {
  const formData = await request.formData();
  const requestText = formData.get("request_text");
  const startRoom = formData.get("start_room");
  const image = formData.get("image");

  if (!requestText || !startRoom || !image) {
    return NextResponse.json(
      { error: "필수 파라미터가 누락되었습니다." },
      { status: 400 }
    );
  }

  const externalFormData = new FormData();
  externalFormData.append("request_text", requestText);
  externalFormData.append("start_room", startRoom);
  externalFormData.append("image", image);

  const response = await fetch(`${EXTERNAL_API_URL}/api/navigation/start`, {
    method: "POST",
    body: externalFormData,
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "알 수 없는 오류" }));
    return NextResponse.json(
      {
        error: errorData.error || "API 요청 실패",
        details: errorData.details,
      },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}

