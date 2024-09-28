"use client";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div className="container prose mx-auto mb-10 mt-5 px-4">
      <h1>エラー</h1>
      <p>{error.message}</p>
    </div>
  );
}
