// Turns the bot's light Markdown into HTML so replies can show bold text, links, and line breaks.
// Model output is untrusted input: escape it first, then add only the tags we create ourselves.
const escapes = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (char) => escapes[char]);
}

export function toHtml(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Only https links, and they open without access to this page.
    .replace(/\[(.+?)\]\((https:\/\/[^\s)]+)\)/g, '<a href="$2" rel="noopener noreferrer nofollow" target="_blank">$1</a>')
    .replace(/\n/g, '<br>');
}
