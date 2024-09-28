import type { Metadata } from "next";
import { notFoundMessage } from "~/consts";

export const metadata: Metadata = {
  title: notFoundMessage,
};

export default function NotFound() {
  return (
    <div className="container prose mx-auto mb-10 mt-5 px-4">
      <h1>{notFoundMessage}</h1>
    </div>
  );
}
