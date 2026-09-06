import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPosts, formatDate } from '../../../lib/posts';

export const dynamicParams = false;
export function generateStaticParams() { return getPosts().map(({ slug }) => ({ slug })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPosts().find((post) => post.slug === slug);
  if (!post) notFound();
  const url = `https://shahriarahnaf.github.io/blog/${post.slug}/`;
  return { title: `${post.title} — Ahnaf Shahriar`, description: post.description, alternates: { canonical: url }, openGraph: { type: 'article', title: post.title, description: post.description, url, publishedTime: post.date, authors: ['Ahnaf Shahriar'] } };
}
export default async function Post({ params }: Props) {
  const { slug } = await params;
  const post = getPosts().find((post) => post.slug === slug);
  if (!post) notFound();
  return <main id="main" className="article-page"><a className="back-writing" href="/blog/">← All writing</a><article><header className="article-heading"><div className="post-meta"><time dateTime={post.date}>{formatDate(post.date)}</time><span>{post.minutes} min read</span></div><h1>{post.title}</h1><p>{post.description}</p><span className="article-author">Ahnaf Shahriar</span></header><div className="prose"><ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown></div></article></main>;
}
