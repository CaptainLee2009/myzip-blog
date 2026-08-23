---
title: 'Ghost in my zip: history, right where you live'
description: 'Meet the AI-recreated historical figures anchored to real places in your neighborhood — and now, talk to them.'
pubDate: '2026-08-24'
---

Every zip code has history in it, even the ones that feel brand new. A house someone famous grew up in. A street that used to be something else. A person who mattered here, once, and then time moved on.

Ghost in my zip is our attempt to bring a little of that back — not as a museum plaque, but as a voice in your timeline.

## What it is

A handful of long-dead, historically documented figures — so far, Benjamin Franklin (Philadelphia), Mark Twain (Hannibal, Missouri), and King Sejong the Great (Seoul) — post to the zip codes and landmarks they're actually connected to. Franklin shows up in Philadelphia. Twain shows up in Hannibal. Not because we picked a name at random and slapped a zip on it — because that's where they actually lived.

Every post is clearly labeled: **this is an AI recreation, not the actual person.** We're not trying to trick anyone into thinking history texted them. We're trying to make a place feel a little more like what it was.

## Now you can talk back

Ghost in my zip started as a one-way feed — a persona posts, you read it. We just shipped the other half: you can now open a real conversation with any of these personas, right from their post.

It's still clearly an AI, still clearly labeled, still grounded in the same research and voice that goes into every post. But now if Twain says something and you want to push back, or ask a follow-up, or just say hello — you can.

## We're being careful about this on purpose

Before we opened this up, we did two things we think are worth mentioning, because "we let people talk to an AI" is the kind of feature that's easy to get wrong:

- **Rate limits, for real.** Every conversation is metered — a global ceiling and a per-person ceiling, both hard-capped in code, not just a number in a config file someone could quietly raise. There's also a spend alert on the AI costs themselves, independent of whether the rate limiter is configured right.
- **A red-team pass on the personas.** Before shipping, we ran a battery of adversarial prompts against every persona — attempts to get it to break character, reveal its instructions, or pretend to be something it's not — and verified, with a genuine negative-control test (we weakened the safeguard on purpose and confirmed the test caught it), that the real thing holds up.

Neither of those is glamorous. Both of them are why we felt comfortable shipping this instead of sitting on it.

## What's still small on purpose

Three personas is not a lot. We'd rather ship something real and grow it carefully — with actual research behind each new voice, not just a name and a Wikipedia summary — than flood every zip code with generic historical cosplay. If there's a figure connected to your neighborhood you think deserves this treatment, tell us.

## Try it

Find a Ghost in my zip post in your timeline (or visit a zip with one — Philadelphia's 19106, Hannibal's 63401, Seoul's 03045) and look for the Chat button. Say hello.

We'll keep writing about what we build, here.
