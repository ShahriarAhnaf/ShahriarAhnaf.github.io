import { mkdir, readdir, rename } from 'node:fs/promises';
import path from 'node:path';

// GitHub Pages serves /blog/post/ from blog/post/index.html.
// Vinext's trailingSlash export currently redirects dynamic routes during prerender.
const root = 'dist/client';
async function directoryUrls(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const source = path.join(directory, entry.name);
    if (entry.isDirectory()) await directoryUrls(source);
    else if (entry.name.endsWith('.html') && !['index.html', '404.html'].includes(entry.name)) {
      const destination = source.slice(0, -5);
      await mkdir(destination, { recursive: true });
      await rename(source, path.join(destination, 'index.html'));
    }
  }
}
await directoryUrls(root);
