import type { APIRoute } from 'astro';
import { SITE_DESCRIPTION } from '../../consts';
import { renderOgCardPng } from '../../lib/og';

export const GET: APIRoute = async () => {
	const png = await renderOgCardPng({
		title: 'Stories from the neighborhood.',
		description: SITE_DESCRIPTION,
		category: 'Neighborhoods',
		dateLabel: 'my.zip',
	});

	return new Response(png, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
};
