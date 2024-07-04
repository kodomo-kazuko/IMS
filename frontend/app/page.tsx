"use client";

const url = process.env.NEXT_PUBLIC_API;

export default function Home() {
  return <div className="flex justify-center items-center h-screen">backend is at {url}</div>;
}
