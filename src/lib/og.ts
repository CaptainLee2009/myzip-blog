import sharp from 'sharp';

export interface OgCardOptions {
	title: string;
	description: string;
	category?: string;
	dateLabel?: string;
}

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function truncateAtWord(text: string, maxChars: number): string {
	if (text.length <= maxChars) return text;
	const sliced = text.slice(0, maxChars - 1);
	const lastSpace = sliced.lastIndexOf(' ');
	const base = lastSpace > Math.floor(maxChars * 0.6) ? sliced.slice(0, lastSpace) : sliced;
	return `${base.replace(/[,;:\-—]+$/, '').trimEnd()}…`;
}

function wrapLines(text: string, maxChars: number, maxLines: number): string[] {
	const words = text.trim().split(/\s+/).filter(Boolean);
	if (words.length === 0) return [];

	const lines: string[] = [];
	let current = '';

	for (let i = 0; i < words.length; i++) {
		const word = words[i];
		const candidate = current ? `${current} ${word}` : word;
		if (candidate.length <= maxChars || !current) {
			current = candidate;
		} else {
			lines.push(current);
			current = word;
			if (lines.length === maxLines - 1) {
				const remaining = [current, ...words.slice(i + 1)].join(' ');
				lines.push(truncateAtWord(remaining, maxChars));
				return lines;
			}
		}
	}

	if (current) {
		lines.push(truncateAtWord(current, maxChars));
	}

	return lines.slice(0, maxLines);
}

export async function renderOgCardPng({
	title,
	description,
	category = 'Dispatches',
	dateLabel = 'my.zip',
}: OgCardOptions): Promise<Uint8Array> {
	const titleLines = wrapLines(title, 30, 3);
	const descLines = wrapLines(description, 72, 2);

	const titleStartY = 215;
	const titleLineHeight = 68;
	const descStartY = titleStartY + titleLines.length * titleLineHeight + 22;
	const descLineHeight = 36;

	const safeCategory = escapeXml(category.toUpperCase().slice(0, 28));
	const badgeWidth = Math.max(124, Math.min(340, safeCategory.length * 11 + 42));
	const safeDate = escapeXml(dateLabel);

	const titleSpans = titleLines
		.map(
			(line, idx) =>
				`<text x="84" y="${titleStartY + idx * titleLineHeight}" font-family="DejaVu Sans, Liberation Sans, Arial, Helvetica, sans-serif" font-size="54" font-weight="700" fill="#0f172a">${escapeXml(line)}</text>`,
		)
		.join('\n  ');

	const descSpans = descLines
		.map(
			(line, idx) =>
				`<text x="84" y="${descStartY + idx * descLineHeight}" font-family="DejaVu Sans, Liberation Sans, Arial, Helvetica, sans-serif" font-size="25" font-weight="400" fill="#475569">${escapeXml(line)}</text>`,
		)
		.join('\n  ');

	const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#f1f5f9" />
    </linearGradient>
    <linearGradient id="accentBar" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bgGrad)" />
  <rect x="0" y="0" width="16" height="630" fill="url(#accentBar)" />

  <circle cx="1120" cy="96" r="140" fill="#eff6ff" />
  <circle cx="1145" cy="115" r="76" fill="#dbeafe" />

  <rect x="84" y="64" width="46" height="46" rx="12" fill="#2563eb" />
  <text x="107" y="96" text-anchor="middle" font-family="DejaVu Sans, Liberation Sans, Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="#ffffff">M</text>
  <text x="146" y="96" font-family="DejaVu Sans, Liberation Sans, Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="#0f172a">MyZip Blog</text>

  <rect x="314" y="69" width="${badgeWidth}" height="36" rx="18" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5" />
  <text x="${314 + Math.round(badgeWidth / 2)}" y="93" text-anchor="middle" font-family="DejaVu Sans, Liberation Sans, Arial, Helvetica, sans-serif" font-size="16" font-weight="700" fill="#2563eb" letter-spacing="1.2">${safeCategory}</text>

  ${titleSpans}
  ${descSpans}

  <line x1="84" y1="534" x2="1116" y2="534" stroke="#cbd5e1" stroke-width="1.5" />
  <text x="84" y="576" font-family="DejaVu Sans, Liberation Sans, Arial, Helvetica, sans-serif" font-size="22" font-weight="700" fill="#2563eb">blog.my.zip</text>
  <text x="232" y="576" font-family="DejaVu Sans, Liberation Sans, Arial, Helvetica, sans-serif" font-size="21" font-weight="400" fill="#64748b">·  Hyper-local Agentic Timeline</text>
  <text x="1116" y="576" text-anchor="end" font-family="DejaVu Sans, Liberation Sans, Arial, Helvetica, sans-serif" font-size="21" font-weight="700" fill="#475569">${safeDate}</text>
</svg>`;

	const pngBuffer = await sharp(Buffer.from(svg))
		.png({ compressionLevel: 9, palette: false })
		.toBuffer();

	return new Uint8Array(pngBuffer);
}
