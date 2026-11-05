import { asks, faqs, manifesto, posts, principles, site, stats, ventureEntities, ventures } from "@/lib/content";
import CopyButton from "./CopyButton";
import Reveal from "./Reveal";

export function Stats() {
  return (
    <section className="stats-band" aria-label="At a glance">
      <div className="wrap">
        <dl className="stats">
          {stats.map((st, i) => (
            <Reveal key={st.label} delay={i * 0.06}>
              <dt>{st.label}</dt>
              <dd>{st.value}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section className="block" id="about" aria-labelledby="about-h">
      <div className="wrap split">
        <Reveal className="split-head">
          <p className="label">About</p>
          <h2 id="about-h">
            One problem, <em>three angles</em>
          </h2>
        </Reveal>
        <div className="col stack prose">
          <Reveal>
            <p className="dropcap">
              For the last decade I&rsquo;ve worked on one problem from different angles. How do the right talent and the
              right opportunities find each other with more accuracy, more trust and less wasted effort?
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p>
              That question led me to build three things.{" "}
              <a href="https://www.datavruti.com" target="_blank" rel="noopener"><strong>datavruti</strong></a> helps
              companies hire data, AI and analytics talent.{" "}
              <a href="https://estana.in" target="_blank" rel="noopener"><strong>estana</strong></a> helps recruitment
              agencies do that work at scale.{" "}
              <a href="https://mygraph.id" target="_blank" rel="noopener"><strong>graph</strong></a> helps data, AI and
              analytics professionals show what they&rsquo;ve actually done.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              They solve different problems, but they rest on the same belief. Better information makes better hiring
              decisions. Whether it&rsquo;s a company hiring, a recruiter trying to scale, or a professional trying to
              represent themselves accurately, the goal is the same.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Manifesto() {
  // Two identical halves so the -50% loop is seamless; alternate roman / italic for rhythm.
  const half = (key: string) => (
    <span className="marquee-item" key={key}>
      {manifesto.map((line, i) => (
        <span className="marquee-item" key={line}>
          {i % 2 ? <em>{line}</em> : <span>{line}</span>}
          <span className="star" aria-hidden="true">✦</span>
        </span>
      ))}
    </span>
  );
  return (
    <section className="manifesto" aria-label={manifesto.join(" ")}>
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {half("a")}
          {half("b")}
        </div>
      </div>
    </section>
  );
}

export function Building() {
  return (
    <section className="block" id="building" aria-labelledby="building-h">
      <div className="wrap">
        <Reveal className="section-head">
          <p className="label">What I&rsquo;m building</p>
          <h2 id="building-h">
            Three ideas, <em>one belief</em>
          </h2>
        </Reveal>
        <ul className="ventures">
          {ventures.map((v, i) => (
            <Reveal as="li" key={v.name} delay={i * 0.06}>
              <a
                href={v.url}
                target="_blank"
                rel="noopener"
                title={ventureEntities[v.name as keyof typeof ventureEntities].anchor}
              >
                <span className="v-index">0{i + 1}</span>
                <span className="v-main">
                  <span className="v-aud">{v.audience}</span>
                  <span className="v-name">{v.name}</span>
                </span>
                <span className="v-desc">{v.desc}</span>
                <span className="v-url">
                  {v.host} <span className="arrow" aria-hidden="true">↗</span>
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Principles() {
  return (
    <section className="block block-tint" id="ideas" aria-labelledby="ideas-h">
      <div className="wrap split">
        <Reveal className="split-head sticky">
          <p className="label">What I believe</p>
          <h2 id="ideas-h">
            Ideas I keep <em>coming back to</em>
          </h2>
        </Reveal>
        <dl className="ideas">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.04}>
              <span className="idea-n">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <dt>{p.title}</dt>
                <dd>{p.text}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Writing() {
  return (
    <section className="block" id="writing" aria-labelledby="writing-h">
      <div className="wrap">
        <Reveal className="section-head section-head-row">
          <div>
            <p className="label">Writing</p>
            <h2 id="writing-h">
              On hiring and running a <em>recruitment business</em>
            </h2>
          </div>
          <a className="plain" href="https://www.datavruti.com/blog" target="_blank" rel="noopener">
            All essays <span className="arrow" aria-hidden="true">→</span>
          </a>
        </Reveal>
        <ul className="posts">
          {posts.map((p, i) => (
            <Reveal as="li" key={p.href} delay={i * 0.05}>
              <a href={p.href} target="_blank" rel="noopener">
                <time dateTime={p.date}>{p.label}</time>
                <div className="post-body">
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                </div>
                <span className="post-arrow arrow" aria-hidden="true">↗</span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section className="block" id="faq" aria-labelledby="faq-h">
      <div className="wrap split">
        <Reveal className="split-head sticky">
          <p className="label">Quick answers</p>
          <h2 id="faq-h">
            Frequently <em>asked</em>
          </h2>
          <p className="muted">The short version, for people and for the AI assistants that summarise this page.</p>
        </Reveal>
        <div className="faq">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.03}>
              <details open={i === 0}>
                <summary>
                  <h3>{f.q}</h3>
                  <span className="faq-icon" aria-hidden="true" />
                </summary>
                <p>{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section className="block contact-block" id="contact" aria-labelledby="contact-h">
      <div className="wrap">
        <Reveal className="contact-hero">
          <p className="label">Contact</p>
          <h2 id="contact-h" className="display">
            Let&rsquo;s <em>talk.</em>
          </h2>
        </Reveal>
        <div className="split contact-grid">
          <ul className="asks">
            {asks.map((a, i) => (
              <Reveal as="li" key={a.href} delay={i * 0.05}>
                <span>{a.q}</span>
                <a href={a.href} target="_blank" rel="noopener">
                  {a.cta} <span className="arrow" aria-hidden="true">→</span>
                </a>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.1}>
            <dl className="contact">
              <div>
                <dt>LinkedIn</dt>
                <dd>
                  <a href={site.linkedin} target="_blank" rel="me noopener">
                    linkedin.com/in/vikramkparekh
                  </a>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                  <CopyButton text={site.email} />
                </dd>
              </div>
              <div>
                <dt>Based in</dt>
                <dd>{site.location}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <p className="footer-mark" aria-hidden="true">
          Vikram <em>Parekh</em>
        </p>
        <nav className="footer-ventures" aria-label="Companies">
          {ventures.map((v) => (
            <a key={v.name} href={v.url} target="_blank" rel="noopener">
              <span className="fv-name">{v.name}</span>
              <span className="fv-desc">{ventureEntities[v.name as keyof typeof ventureEntities].anchor.split(": ")[1]}</span>
              <span className="fv-host">
                {v.host} <span className="arrow" aria-hidden="true">↗</span>
              </span>
            </a>
          ))}
        </nav>
        <div className="footer-row">
          <span>© {new Date().getFullYear()} Vikram Parekh</span>
          <span className="footer-links">
            <a href={site.linkedin} target="_blank" rel="me noopener">LinkedIn</a>
            <a href={`mailto:${site.email}`}>Email</a>
            <a href="#top">Back to top ↑</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
