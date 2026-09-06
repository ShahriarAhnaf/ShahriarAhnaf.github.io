import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export function getPosts() {
  return fs.readdirSync(path.join(process.cwd(), 'content/posts'))
    .filter((file) => file.endsWith('.md'))
    .flatMap((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(process.cwd(), 'content/posts', file), 'utf8'));
      if (data.draft === true) return [];
      const slug = file.slice(0, -3);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || typeof data.title !== 'string' || typeof data.description !== 'string' || typeof data.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.date) || !Number.isFinite(Date.parse(data.date))) {
        throw new Error(`${file}: use a lowercase hyphenated filename and title, description, and quoted YYYY-MM-DD date.`);
      }
      return [{ slug, title: data.title, description: data.description, date: data.date, content, minutes: Math.max(1, Math.ceil(content.split(/\s+/).length / 220)) }];
    }).sort((a, b) => b.date.localeCompare(a.date));
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(date));
}
