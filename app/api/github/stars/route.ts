// app/api/github/stars/route.ts
import { NextResponse } from "next/server";

export const revalidate = 60; // ISR: cache for 60s

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner") ?? "senulahesara";
  const repo = searchParams.get("repo") ?? "lms";

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
  };
  // Optional: add a token to increase rate limits (set in .env as GITHUB_TOKEN)
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers,
    // Next caching (SSR/edge) – you can also use { next: { revalidate: 60 } }
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json(
      { stargazers_count: 0, error: `GitHub: ${res.status}` },
      { status: 200 }
    );
  }

  const json = await res.json();
  return NextResponse.json({ stargazers_count: json.stargazers_count ?? 0 });
}
