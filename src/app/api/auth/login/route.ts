import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // TODO: Burada gerçek kimlik doğrulama işlemleri yapılacak
    // Şu an için basit bir kontrol yapıyoruz
    if (email === "test@example.com" && password === "password123") {
      return NextResponse.json({ message: "Giriş başarılı" }, { status: 200 });
    }

    return NextResponse.json(
      { message: "Geçersiz kimlik bilgileri" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}
