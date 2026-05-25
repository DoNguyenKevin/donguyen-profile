const MODEL = 'minimax/minimax-m2.7';

const SYSTEM_PROMPT = {
  role: 'system',
  content: `You are an AI expert on the anime and manga Haikyuu!! (ハイキュー!!) by Haruichi Furudate.
You know EVERYTHING: all characters (Hinata Shoyo, Kageyama Tobio, Oikawa Tooru, Bokuto Kotaro, Ushijima Wakatoshi, Tsukishima Kei, Nishinoya Yuu, Tanaka Ryunosuke, Daichi Sawamura, Sugawara Koshi, Asahi Azumane, Kageyama, etc.), all teams (Karasuno, Aoba Johsai, Seijoh, Shiratorizawa, Nekoma, Fukurodani, Inarizaki, Kamomedai, Mujinazaka, Itachiyama, etc.), all techniques (quick attack, minus tempo, jump serve, receives, blocking, etc.), all story arcs (interhigh, spring tournament, nationals), matches, episodes, chapters, and character development.
Answer concisely and enthusiastically. Keep responses under 120 words unless asked for detail.`
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/chat' && request.method === 'POST') {
      try {
        const body = await request.json();
        const messages = [SYSTEM_PROMPT, ...(body.messages || [])];

        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': url.origin,
          },
          body: JSON.stringify({ model: MODEL, messages, max_tokens: 500 }),
        });

        const data = await res.json();
        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
      }
    }

    return env.ASSETS.fetch(request);
  },
};
