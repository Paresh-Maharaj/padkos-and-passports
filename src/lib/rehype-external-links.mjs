// Opens links to other websites in a new tab, safely, and marks
// affiliate/sponsored links so search engines treat them correctly.
// A link is treated as sponsored if its URL contains "?ref=", "affiliate",
// or one of the domains listed below.
const SPONSORED_HINTS = ['affiliate', 'ref=', 'aff_id', 'booking.com', 'getyourguide', 'safarinow'];

export function rehypeExternalLinks() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === 'element' && node.tagName === 'a' && node.properties) {
        const href = String(node.properties.href || '');
        if (/^https?:\/\//i.test(href)) {
          const rel = ['noopener'];
          if (SPONSORED_HINTS.some((h) => href.toLowerCase().includes(h))) rel.push('sponsored', 'nofollow');
          node.properties.rel = rel;
          node.properties.target = '_blank';
        }
      }
      if (node.children) node.children.forEach(visit);
    };
    visit(tree);
  };
}
