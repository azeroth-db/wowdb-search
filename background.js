// Address-bar keyword "wow" and a right-click lookup, both opening wowdb.wiki's WoW Forever search.
const SITE = 'https://wowdb.wiki';
const DAY = 24 * 60 * 60 * 1000;
const searchUrl = (text) => `${SITE}/forever/search#q=${encodeURIComponent(text.trim())}`;
const open = (text) => chrome.tabs.create({ url: searchUrl(text) });

// The site's search index, reduced to unique names and kept for a day.
async function names() {
  const { index } = await chrome.storage.local.get('index');
  if (index && Date.now() - index.at < DAY) return index.names;
  const response = await fetch(`${SITE}/api/forever/search`);
  const { rows } = await response.json();
  const unique = [...new Set(Object.values(rows).flat().map((row) => row[1]).filter((name) => typeof name === 'string'))];
  await chrome.storage.local.set({ index: { at: Date.now(), names: unique } });
  return unique;
}

const escape = (text) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

chrome.omnibox.setDefaultSuggestion({ description: chrome.i18n.getMessage('omnibox') });
chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
  const query = text.trim().toLocaleLowerCase();
  // Two characters, where the site's own header search begins (spec.mdx, navigation and search).
  if (query.length < 2) return suggest([]);
  const all = await names().catch(() => []);
  const starts = all.filter((name) => name.toLocaleLowerCase().startsWith(query));
  const contains = all.filter((name) => !name.toLocaleLowerCase().startsWith(query) && name.toLocaleLowerCase().includes(query));
  suggest([...starts, ...contains].map((name) => ({ content: name, description: escape(name) })));
});
chrome.omnibox.onInputEntered.addListener((text) => open(text));

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: 'lookup', title: chrome.i18n.getMessage('lookup'), contexts: ['selection'] });
});
chrome.contextMenus.onClicked.addListener((info) => { if (info.selectionText) open(info.selectionText); });
