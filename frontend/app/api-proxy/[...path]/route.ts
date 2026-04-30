import { NextResponse } from "next/server";

/** Explicit proxy so client fetch("/api-proxy/...") works on Vercel (rewrites alone often 404). */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function backendOrigin(): string | null {
  const raw = process.env.BACKEND_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/$/, "");
}

async function forward(request: Request, pathSegments: string[]): Promise<Response> {
  const origin = backendOrigin();
  if (!origin) {
    return NextResponse.json(
      { detail: "BACKEND_URL is not configured on this deployment." },
      { status: 503 },
    );
  }

  const path = pathSegments.join("/");
  const incoming = new URL(request.url);
  const targetUrl = `${origin}/${path}${incoming.search}`;

  const headers = new Headers();
  const ct = request.headers.get("content-type");
  if (ct) headers.set("content-type", ct);
  const accept = request.headers.get("accept");
  if (accept) headers.set("accept", accept);

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
  };

  if (!["GET", "HEAD"].includes(request.method)) {
    const body = await request.arrayBuffer();
    if (body.byteLength > 0) init.body = body;
  }

  const res = await fetch(targetUrl, init);
  const out = new Headers();
  const outCt = res.headers.get("content-type");
  if (outCt) out.set("content-type", outCt);

  return new NextResponse(await res.arrayBuffer(), {
    status: res.status,
    headers: out,
  });
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(request: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(request, path);
}

export async function HEAD(request: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(request, path);
}

export async function POST(request: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(request, path);
}

export async function PUT(request: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(request, path);
}

export async function PATCH(request: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(request, path);
}

export async function DELETE(request: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(request, path);
}

export async function OPTIONS(request: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(request, path);
}
