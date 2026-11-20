import { z } from "zod";

const item = z.object({ title: z.string(), description: z.string() });
export const aboutSchema = z.object({
  name: z.string(), publicName: z.string(), role: z.string(), location: z.string(),
  title: z.string(), subtitle: z.string(), portrait: z.string(),
  biography: z.array(z.string()), personality: z.array(item),
  humanTitle: z.string(), humanPoints: z.array(z.string()), humanQuote: z.string(),
  interests: z.array(item), communityTitle: z.string(), communityIntro: z.string(), communities: z.array(z.string()),
  growthTitle: z.string(), growthIntro: z.string(), growthPoints: z.array(z.string()), growthQuote: z.string(),
  developerTitle: z.string(), developerIntro: z.string(), disciplines: z.array(z.string()),
  messageTitle: z.string(), message: z.array(z.string()), seoTitle: z.string(), seoDescription: z.string(),
});
export type AboutContent = z.infer<typeof aboutSchema>;

export const aboutFallback: AboutContent = {
  name: "Nelson Oundo", publicName: "CAT PHOENIX", role: "Young Web Developer & Technology Enthusiast", location: "Uganda",
  title: "Beyond the name: who is CAT PHOENIX?",
  subtitle: "A developer. A friend. A learner. A story still unfolding.", portrait: "",
  biography: [
    "Nelson Oundo, popularly known as CAT PHOENIX, is a young Ugandan developer, technology enthusiast and creative mind passionate about building things that make a difference.",
    "Behind the CAT PHOENIX identity is someone who believes in friendship, loyalty, personal growth and the importance of creating something meaningful.",
    "He is more than the websites, applications, projects and technology he creates. He is a person with memories, ambitions, emotions, experiences and a story that continues to unfold.",
    "He enjoys exploring technology, developing websites, experimenting with digital ideas and turning imagination into something people can interact with.",
    "His journey is still developing, but his curiosity and determination continue to push him towards greater possibilities.",
  ],
  personality: [
    { title: "Caring", description: "He genuinely cares about the people he loves and often tries to support them, even when they don't notice." },
    { title: "Protective", description: "He values the people close to him and believes in standing by friends and family." },
    { title: "Loyal", description: "Friendship means something to him. He values meaningful connections and doesn't easily forget the people who have been part of his journey." },
    { title: "Emotional but strong", description: "He can appear tough and quiet, but there is a thoughtful and emotional side behind that appearance." },
    { title: "Private", description: "He sometimes keeps his worries to himself and takes time to process his experiences." },
    { title: "Thoughtful", description: "He appreciates memories, meaningful conversations, friendship and the little things that make life special." },
  ],
  humanTitle: "Not everything about me is code.",
  humanPoints: ["He enjoys making people feel appreciated.", "He remembers meaningful moments and friendships.", "He believes in forgiveness and giving people room to grow.", "He values silence when he needs time to reflect.", "He understands that some experiences teach lessons that words cannot explain.", "He believes that moving forward does not mean pretending the past never happened.", "He is continuously learning to communicate better and understand himself."],
  humanQuote: "Some stories are never told completely. Some lessons are learned quietly. And some of the strongest people are still figuring themselves out.",
  interests: [
    { title: "Technology", description: "Web development, programming, websites, applications, bots and digital innovation." },
    { title: "Friendship", description: "Spending quality time with friends and making unforgettable memories." },
    { title: "Travel", description: "Enjoying trips, adventures and exploring places with friends." },
    { title: "Entertainment", description: "Gaming, music, hanging out and having fun." },
    { title: "Food", description: "Good food and enjoying meals with people he appreciates." },
    { title: "Fashion", description: "A preference for grey and black, with a cool and relaxed clothing style." },
    { title: "Faith", description: "Prayer, reflection and appreciating the importance of faith in everyday life." },
  ],
  communityTitle: "People make the journey memorable.",
  communityIntro: "Friendships, school communities and shared moments are part of Nelson's personal story. These names represent meaningful memories and people who have contributed to his journey, not verified official affiliations.",
  communities: ["Yellow Members Family", "Altar Servers Family", "Choristers Family", "Public Speakers Family", "Student Leaders", "Nyerere Family", "Science Fair Family", "Senior Four Green Family", "Crazy Company Family"],
  growthTitle: "Still learning. Still growing.", growthIntro: "Nelson is not perfect. Personal growth is a continuing part of his journey, and he is working on:",
  growthPoints: ["Patience", "Managing emotions", "Listening to constructive criticism", "Communicating when something is bothering him", "Understanding different perspectives", "Knowing when to speak and when to remain silent", "Becoming more understanding and self-aware"],
  growthQuote: "I don't claim to have everything figured out. I am still learning, correcting myself, growing and becoming a better version of who I was yesterday.",
  developerTitle: "The mind behind CAT CPN.", developerIntro: "CAT CPN is the creative technology brand behind Nelson's digital projects. He explores ideas through code, building websites, applications and tools that people can interact with.",
  disciplines: ["Website development", "Web applications", "Programming", "Digital tools", "Bot development", "Creative technology projects"],
  messageTitle: "A message to the world.",
  message: ["People may know your name, recognize your face or admire what you create, but there is always another side of a person that only time, friendship and genuine understanding can reveal.", "I am Nelson Oundo. CAT PHOENIX is the name behind my creative journey, but it is not everything that defines me.", "I am a work in progress, a friend, a learner, a dreamer and a developer building his own story."],
  seoTitle: "Nelson Oundo (CAT PHOENIX) | CAT CPN Founder & Web Developer Uganda",
  seoDescription: "Meet Nelson Oundo, known as CAT PHOENIX: a young web developer in Uganda and creator of CAT CPN. Explore his projects, values, interests and personal journey.",
};

export function resolveAboutContent(value: unknown): AboutContent {
  const parsed = aboutSchema.safeParse(value);
  return parsed.success ? parsed.data : aboutFallback;
}

// Only actual public destinations are eligible for portfolio links.
export function isPublicProjectLink(link: string): boolean {
  try { const url = new URL(link); return url.protocol === "https:" || url.protocol === "http:"; }
  catch { return false; }
}