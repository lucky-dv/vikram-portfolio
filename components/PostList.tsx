import type { PostCard } from "@/lib/posts";
import Reveal from "./Reveal";

export default function PostList({ items }: { items: PostCard[] }) {
  return (
    <ul className="posts">
      {items.map((p, i) => (
        <Reveal as="li" key={p.href} delay={Math.min(i, 6) * 0.05}>
          <a href={p.href} {...(p.external ? { target: "_blank", rel: "noopener" } : {})}>
            <span className="post-meta">
              <time dateTime={p.date}>{p.label}</time>
              <span className="post-source">
                {p.external ? `On ${p.source}` : p.readingMinutes ? `${p.readingMinutes} min read` : "Essay"}
              </span>
            </span>
            <div className="post-body">
              <h3>{p.title}</h3>
              {p.excerpt && <p>{p.excerpt}</p>}
            </div>
            <span className="post-arrow arrow" aria-hidden="true">
              {p.external ? "↗" : "→"}
            </span>
          </a>
        </Reveal>
      ))}
    </ul>
  );
}
