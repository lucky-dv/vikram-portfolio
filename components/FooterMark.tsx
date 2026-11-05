"use client";

import { usePathname } from "next/navigation";

/** The large name wordmark closes the homepage only; inner pages already carry the name in header and byline. */
export default function FooterMark() {
  if (usePathname() !== "/") return null;
  return (
    <p className="footer-mark" aria-hidden="true">
      Vikram <em>Parekh</em>
    </p>
  );
}
