"use client";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();

  if (session) console.log(session)
  return (
    <div className="bg-background h-screen flex justify-center items-center">
      <h1 className="font-bold text-3xl text-foreground">Hello world!</h1>
    </div>
  );
}
