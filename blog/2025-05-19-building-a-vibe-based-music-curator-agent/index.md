---
slug: building-a-vibe-based-music-curator-agent
title: Building a Vibe-Based Music Curator Agent
authors: [hrsdimitrov]
tags: [ai agent]
---

In this blog post, I’ll show how to create a <SiteName/> agent that mixes AI with real-world data to build something fun: a playlist generator based on vibes. The idea is simple — you type in a mood or situation, like “a rooftop party with friends”, and the agent gives you 15 Spotify songs that match the vibe. It also explains why each song fits.

<!-- truncate -->

This project is a great example of how <SiteName/> agents can use AI to understand natural language and work with APIs to create useful results.

## Creating a Runtime Instance

To run our agent, we first need a runtime instance. We’ll use the <SiteName/> dashboard to create it — no code needed here.

For this project, we’ll choose a machine with:

-   **Model**: `gemma3:27b`
-   **CPU type**: `n1-highmem-4`
-   **GPU**: `nvidia-tesla-t4` (2 GPUs)
-   **Disk size**: `100GB`

Once the instance is ready, we’ll use it when creating and running the agent for this tutorial.

## Creating the agent

With the runtime instance ready, we can now create the agent itself. This agent will respond to natural language descriptions of a mood or situation by generating a Spotify playlist — all with the help of a local LLM.

The agent does four main things:

1. It turns the vibe into search terms using an LLM.
2. It searches Spotify for matching songs.
3. It explains why each song fits the vibe.
4. Formats the response and returns it.

The full logic for the agent can be found in <SiteName/>’s official repository of example agents. For this blog post, I’ll highlight two key code snippets that show roughly how the agent works.

```javascript
const songList = songs
	.map((s, i) => `${i + 1}. "${s.title}" – ${s.artist}`)
	.join("\n");

const prompt = `
        You're a music curator. For each of the songs below, explain in 1–2 sentences why it fits the mood: "${vibe}".

        Songs:
        ${songList}

        Return a list with numbers and reasons.
    `;

const response = await ollama.generate({
	model: "gemma3:27b",
	prompt,
});

const lines = response.response.split("\n").filter(Boolean);

return songs.map((song, i) => ({
	...song,
	reason: lines[i]?.replace(/^\d+\.\s*/, "") || "No explanation provided",
}));
```

This part of the agent takes the list of songs and asks the LLM to explain, in 1–2 sentences, why each song fits the original vibe. The explanations are then matched back to the songs and included in the final result.

```javascript
const vibe = context.params.vibe?.trim();
if (!vibe) {
	events.emitQueryCompleted({
		data: { error: "Missing 'vibe' parameter." },
	});
	return;
}

const vibeQueryResponse = await ollama.generate({
	model: "gemma3:27b",
	prompt: `Return a short, comma-separated list (max 5 items) of music keywords, genres, or moods to search Spotify for the vibe: "${vibe}". Do not explain.`,
});

let searchQuery = vibeQueryResponse.response.trim();

if (searchQuery.length > 100) {
	searchQuery = searchQuery.split(/\s+/).slice(0, 10).join(" ");
}

const token = await getSpotifyAccessToken();
const songs = await searchSongs(searchQuery, token);
const explainedSongs = await explainSongs(ollama, vibe, songs);

events.emitQueryCompleted({
	data: {
		title: `Playlist for: ${vibe}`,
		vibe,
		songs: explainedSongs,
	},
});
```

This snippet handles the main workflow of the agent: it takes the user's vibe input, uses the LLM to generate a short list of music-related search terms, queries Spotify for matching songs, and then prepares the final playlist with explanations.

## Uploading the agent

Once the agent code is ready, we can upload it to <SiteName/>. This can be done either through the <SiteName/> dashboard or using the <SiteName/> CLI.

When uploading, make sure to set the entry point to `myAgent`, as this is the function that defines the agent’s logic. You’ll also need to define one parameter: `vibe` – a string that describes the mood or situation the user wants a playlist for (e.g. _“a rainy morning with tea”_)

After uploading, the agent will be linked to the runtime instance we created earlier and ready to test.

## Testing the agent

For this blog post, we’ll use the <SiteName/> dashboard to test the agent. The dashboard lets us run test queries directly and monitor the agent’s output in real time.

To view the full response, we can use a free tool like [webhook.site](https://webhook.site). By creating a temporary webhook URL and adding it to the agent’s webhook configuration, we can easily inspect the full data returned by the agent after a query is executed.

For example, running a test query with the input `A party with friends.`:

```json
{
	"title": "Playlist for: A party with friends.",
	"vibe": "A party with friends.",
	"songs": [
		{
			"title": "Like It",
			"artist": "Kumi Koda",
			"url": "https://open.spotify.com/track/78Q5Tvh52OcWlukIy6vOL1",
			"reason": "Here's a breakdown of why each song fits the \"party with friends\" mood:"
		},
		{
			"title": "A Good Thing",
			"artist": "Upbeat Retail",
			"url": "https://open.spotify.com/track/5MLfM9KTuAhU8zYmfxNP3t",
			"reason": "**\"Like It\" – Kumi Koda:** This track has a driving beat and energetic vocals that instantly make you want to move – perfect for getting a party started."
		},
		{
			"title": "I Know",
			"artist": "Big Sean",
			"url": "https://open.spotify.com/track/6rje9f1wRFJDO2iTORw0lH",
			"reason": "**\"A Good Thing\" – Upbeat Retail:** The positive vibes and catchy melody create a lighthearted and feel-good atmosphere, ideal for hanging out with friends."
		}
		// ...
	]
}
```

In a real-world scenario, this agent would typically be used programmatically — for example, as part of a web app, mobile interface, or chatbot. Instead of manually entering test queries in the dashboard, other services could send requests to the agent and receive structured playlist data in response, making it easy to integrate into interactive applications.

## Conclusion

This project shows how easy and fun it is to build an AI-powered agent with <SiteName/>. By combining a language model with the Spotify API, we created a tool that turns any vibe into a curated playlist — complete with explanations for each song.

With just a few steps, we went from an idea to a working agent that understands natural language, talks to real APIs, and returns meaningful results. This same approach could be used to build travel planners, study helpers, or recommendation tools for books, movies, and more — all powered by AI and real data.
