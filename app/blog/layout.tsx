export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><a className="wordmark" href="/">Ahnaf<span>.</span></a><nav aria-label="Main navigation"><a href="/#work">Work</a><a href="/blog/" aria-current="page">Writing</a><a href="/#about">About</a></nav><a className="contact-link" href="mailto:founders@simantic.dev">Let's talk</a></header>
    {children}
    <footer className="blog-footer"><a href="/">Ahnaf Shahriar</a><a href="https://x.com/enough_ahnaf">Find me on X</a></footer>
  </>;
}
