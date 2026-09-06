import type { Metadata } from 'next';
import { getPosts, formatDate } from '../../lib/posts';
export const metadata: Metadata = {
  title: 'Writing — Ahnaf Shahriar',
  description: 'Notes on software, hardware, and building things.',
  alternates: { canonical: 'https://shahriarahnaf.github.io/blog/' },
};
export default function Blog() {
  const posts = getPosts();
  return <main id="main" className="writing-page">
    <div className="writing-heading"><span className="section-kicker">Notes from the workbench</span><h1>Writing.</h1><p>Software, hardware, and what I learn along the way.</p></div>
    <div className="post-list">{posts.length ? posts.map((post) => <a className="post-preview" href={`/blog/${post.slug}/`} key={post.slug}><span className="post-meta"><time dateTime={post.date}>{formatDate(post.date)}</time><span>{post.minutes} min read</span></span><h2>{post.title}</h2><p>{post.description}</p><span className="post-read">Read post →</span></a>) : <p className="writing-empty">No posts published yet. Check back soon.</p>}</div>
  </main>;
}
