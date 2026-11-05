import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import { Footer } from "@/components/Sections";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <a className="skip" href="#content">
        Skip to content
      </a>
      <Header />
      {children}
      <Footer />
    </SmoothScroll>
  );
}
