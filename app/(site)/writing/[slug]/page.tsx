import type { Metadata } from "next";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import ShareBar from "@/components/ShareBar";
import { site } from "@/lib/content";
import { findMovedSlug, fmtDate, getPublishedPost, getPublishedPosts } from "@/lib/posts";
import { autoExcerpt, renderArticle } from "@/lib/sanitize";

export const revalidate = 3600;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPublishedPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Not found", robots: { index: false } };
  const description = post.seoDescription || post.excerpt || autoExcerpt(post.content, 155);
  const title = post.seoTitle || post.title;
  const url = `${site.url}/writing/${post.slug}`;
  const images = post.coverImage ? [{ url: post.coverImage, alt: post.coverAlt || post.title }] : undefined;
  return {
    title: title.length > 48 ? { absolute: title } : title,
    description,
    alternates: { canonical: `/writing/${post.slug}` },
    authors: [{ name: site.name, url: site.url }],
    openGraph: {
      type: "article",
      url,
      title,
      description,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [site.url],
      ...(images ? { images } : {}),
    },
    twitter: { card: "summary_large_image", title, description, ...(images ? { images: images.map((i) => i.url) } : {}) },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post || !post.publishedAt) {
    const moved = await findMovedSlug(slug);
    if (moved) permanentRedirect(`/writing/${moved}`);
    notFound();
  }

  const more = (await getPublishedPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);
  const url = `${site.url}/writing/${post.slug}`;
  const description = post.seoDescription || post.excerpt || autoExcerpt(post.content, 155);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description,
        url,
        mainEntityOfPage: url,
        datePublished: post.publishedAt.toISOString(),
        dateModified: post.updatedAt.toISOString(),
        ...(post.coverImage ? { image: post.coverImage } : {}),
        author: { "@type": "Person", "@id": `${site.url}/#person`, name: site.name, url: site.url },
        publisher: { "@type": "Person", "@id": `${site.url}/#person`, name: site.name },
        isPartOf: { "@id": `${site.url}/writing#blog` },
        inLanguage: "en",
        timeRequired: `PT${post.readingMinutes}M`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: "Writing", item: `${site.url}/writing` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <main id="top" className="page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <article className="article">
        <header className="article-head wrap">
          {/* CSS entrance, not JS: the title is the page's largest text and must paint before hydration */}
          <div className="article-head-inner rise">
            <a className="crumb" href="/writing">
              <span className="arrow" aria-hidden="true">←</span> All writing
            </a>
            <h1 className="article-title">{post.title}</h1>
            {post.excerpt && <p className="article-dek">{post.excerpt}</p>}
            <p className="article-meta">
              <span>{site.name}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.publishedAt.toISOString()}>{fmtDate(post.publishedAt)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readingMinutes} min read</span>
            </p>
          </div>
        </header>

        {post.coverImage && (
          <div className="wrap">
            <figure className="article-cover">
              <Image
                src={post.coverImage}
                alt={post.coverAlt || post.title}
                width={1720}
                height={968}
                priority
                sizes="(min-width: 908px) 860px, 100vw"
                style={{ maxHeight: `min(${post.coverHeight}px, 75vh)`, objectPosition: post.coverPosition }}
              />
            </figure>
          </div>
        )}

        <div className="wrap article-body-wrap" id="content" tabIndex={-1}>
          {/* Content is sanitised on save (lib/sanitize.ts); renderArticle only adds lazy-loading hints */}
          <div className="prose-article" dangerouslySetInnerHTML={{ __html: renderArticle(post.content) }} />
          <footer className="article-foot">
            <ShareBar url={url} title={post.title} />
            <div className="author-card">
              <Image src="/vikram.jpg" alt={site.name} width={64} height={80} className="author-img" />
              <div>
                <p className="author-name">{site.name}</p>
                <p className="muted">
                  Co-founder of <a href="https://www.datavruti.com" target="_blank" rel="noopener">datavruti</a>, building{" "}
                  <a href="https://estana.in" target="_blank" rel="noopener">estana</a> and{" "}
                  <a href="https://mygraph.id" target="_blank" rel="noopener">graph</a>.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </article>

      {more.length > 0 && (
        <section className="block" aria-labelledby="more-h">
          <div className="wrap">
            <div className="section-head">
              <p className="label">Keep reading</p>
              <h2 id="more-h">More from <em>Vikram</em></h2>
            </div>
            <ul className="posts">
              {more.map((p) => (
                <li key={p.id}>
                  <a href={`/writing/${p.slug}`}>
                    <span className="post-meta">
                      <time dateTime={p.publishedAt!.toISOString()}>{fmtDate(p.publishedAt!)}</time>
                      <span className="post-source">{p.readingMinutes} min read</span>
                    </span>
                    <div className="post-body">
                      <h3>{p.title}</h3>
                      {p.excerpt && <p>{p.excerpt}</p>}
                    </div>
                    <span className="post-arrow arrow" aria-hidden="true">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
