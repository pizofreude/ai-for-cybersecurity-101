// Turns the bot's light Markdown into HTML so replies can show bold text, links, and line breaks.
export function toHtml(text) {
  return String(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n/g, '<br>');
}
