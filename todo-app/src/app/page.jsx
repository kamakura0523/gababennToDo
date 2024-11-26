"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth"); // `/auth` にリダイレクト
  }, [router]);

  return null; // このページには何も表示しない
}
