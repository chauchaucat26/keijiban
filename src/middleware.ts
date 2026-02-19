import { auth0 } from "./lib/auth0";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const host = request.headers.get("host");

    const allowedHost = "chat.chauchaucat.f5.si";

    // 🌐 ホスト制限
    if (host !== allowedHost) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    // 🔐 Auth0 Middleware
    return await auth0.middleware(request);
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"
    ]
};
