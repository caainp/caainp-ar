import { NextResponse } from "next/server";

const EXTERNAL_API_URL = "https://windopper-caainp-backend.hf.space";

export async function POST(request: Request) {
  const formData = await request.formData();
  const image = formData.get("image");

  if (!image) {
    return NextResponse.json(
      { error: "이미지가 필요합니다." },
      { status: 400 }
    );
  }

  const cookieHeader = request.headers.get("cookie");

  const externalFormData = new FormData();
  externalFormData.append("image", image);

  const headers: HeadersInit = {};
  if (cookieHeader) {
    headers["Cookie"] = cookieHeader;
  }

  const response = await fetch(`${EXTERNAL_API_URL}/api/navigation/step`, {
    method: "POST",
    headers,
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
  const nextResponse = NextResponse.json(data);

  const setCookieHeaders = response.headers.getSetCookie();
  setCookieHeaders.forEach((cookie) => {
    nextResponse.headers.append("set-cookie", cookie);
  });

  return nextResponse;
}

