import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { renderOgCardPng } from '../../lib/og';

export const getStaticPaths: GetStaticPaths = async () => {
	const posts = await getCollection('blog');
	return posts.map((post) => ({
		params: { slug: post.id },
		props: { post },
	}));
};

interface Props {
	post: CollectionEntry<'blog'>;
}

export const GET: APIRoute = async ({ props }) => {
	const { post } = props as Props;
	const dateLabel = post.data.pubDate.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		timeZone: 'UTC',
	});

	const png = await renderOgCardPng({
		title: post.data.title,
		description: post.data.description,
		category: post.data.category || 'Story',
		dateLabel,
	});

	return new Response(png, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
};
