// app/api/blog/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// Check for API key immediately
if (!process.env.GROQ_API_KEY) {
  console.error("❌ CRITICAL: GROQ_API_KEY is missing from your .env.local file!");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const topicPool = [
  { category: "Wedding", title: "Nigerian Wedding Cake Trends Dominating 2026" },
  { category: "Catering", title: "How to Calculate Food Quantities for a 100-Guest Party" },
  { category: "Baking", title: "The Secret to Keeping Cakes Moist in Lagos Weather" },
  { category: "Small Chops", title: "Puff-Puff, Samosa, or Spring Roll: The Ultimate Small Chops Guide" },
  { category: "Cakes", title: "Fondant vs. Buttercream: Which is Best for Your Event?" },
  { category: "Food Tips", title: "How to Safely Transport a Multi-Tier Wedding Cake" },
  { category: "Catering", title: "Corporate Event Catering Etiquette Every Host Should Know" },
  { category: "Recipes", title: "The Secret Ingredient for Fluffier Nigerian Meat Pies" },
  { category: "Events", title: "How to Create a Stunning Dessert Backdrop for Party Photos" },
  { category: "Cakes", title: "Top 5 Custom Birthday Cake Themes for Kids This Year" },
  { category: "Baking", title: "Healthy Baking Substitutes for Traditional Pastries" },
  { category: "Small Chops", title: "How to Keep Small Chops Crispy Hours After Frying" },
  { category: "Wedding", title: "The Psychology of Cake Colors: What Your Choice Says About You" },
  { category: "Catering", title: "Budgeting Smartly for Your Wedding Reception Catering" },
  { category: "Food Tips", title: "How to Properly Store Leftover Party Small Chops" },
  { category: "Recipes", title: "Step-by-Step Guide to Making Perfect, Crunchy Chin-Chin" },
  { category: "Events", title: "DIY vs. Professional Catering: What You Actually Need to Know" },
  { category: "Cakes", title: "Why a Cake Tasting Session is Crucial Before Booking" },
  { category: "Baking", title: "The Art of Tempering Chocolate for Professional Cake Decorations" },
  { category: "Catering", title: "Eco-Friendly Packaging Ideas for Your Confectionery Business" },
  { category: "Small Chops", title: "The Rise of Gourmet Gizdodo at Modern Nigerian Parties" },
  { category: "Wedding", title: "How to Pair Your Wedding Cake Flavor with Your Champagne" },
  { category: "Food Tips", title: "5 Common Baking Mistakes That Ruin Your Pastries (And How to Fix Them)" },
  { category: "Recipes", title: "Easy No-Bake Dessert Recipes for Last-Minute Guests" },
  { category: "Catering", title: "How to Handle Dietary Restrictions (Vegan, Gluten-Free) at Large Events" },
  { category: "Cakes", title: "The History and Cultural Significance of the Nigerian Wedding Cake" },
  { category: "Events", title: "Trending Dessert Table Ideas Beyond the Traditional Wedding Cake" },
  { category: "Baking", title: "How to Start a Home-Based Confectionery Business in Nigeria" },
  { category: "Small Chops", title: "Miniature Food: Why Bite-Sized Party Snacks are Taking Over" },
  { category: "Catering", title: "The Ultimate Checklist for Hiring a Caterer in Lagos" },
];

function getRandomTopics(count: number) {
  const shuffled = [...topicPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getImageUrl(category: string): string {
  // Using Unsplash Source - More reliable than Pixabay
  const images: Record<string, string> = {
    Wedding: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&auto=format&fit=crop&q=80",
    Catering: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80",
    Baking: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80",
    Cakes: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80",
    "Small Chops": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=80",
    "Food Tips": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80",
    Events: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop&q=80",
    Recipes: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&auto=format&fit=crop&q=80",
  };
  return images[category] || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80";
}

function getFallbackPosts(selectedTopics: typeof topicPool) {
  return selectedTopics.map((topic) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 14));
    return {
      id: crypto.randomUUID(),
      title: topic.title,
      excerpt: `Discover expert insights about ${topic.title.toLowerCase()} from Bisoyin Confectionery & Catering.`,
      content: `<p>Detailed article content would go here. This is a high-quality fallback to ensure your blog always displays beautifully.</p><p>At Bisoyin Confectionery & Catering, we believe in delivering excellence in every bite.</p>`,
      image: getImageUrl(topic.category),
      category: topic.category,
      date: date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      readTime: `${Math.floor(Math.random() * 4) + 3} min read`,
      slug: topic.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };
  });
}

export async function GET(request: NextRequest) {
  console.log("🚀 [BLOG API] Request received");
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const requestedSlug = searchParams.get("slug");
    console.log("🔍 [BLOG API] Requested slug:", requestedSlug);
    
    let selectedTopics;

    if (requestedSlug) {
      const foundTopic = topicPool.find(t => 
        t.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === requestedSlug
      );
      
      if (!foundTopic) {
        console.warn(`️ [BLOG API] Topic NOT FOUND for slug: ${requestedSlug}`);
        return NextResponse.json({ posts: [] }, { status: 404 });
      }
      
      selectedTopics = [foundTopic];
      console.log(`✅ [BLOG API] Found topic: "${foundTopic.title}"`);
    } else {
      selectedTopics = getRandomTopics(6);
      console.log(` [BLOG API] Generated ${selectedTopics.length} random topics`);
    }

    console.log("⏳ [BLOG API] Calling Groq API...");
    const generatedPosts = await Promise.all(
      selectedTopics.map(async (topic) => {
        const completion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are an expert food blogger for 'Bisoyin Confectionery & Catering'. Your writing is engaging, authoritative, and culturally relevant to Nigerian events."
            },
            {
              role: "user",
              content: `Write a comprehensive blog post about: "${topic.title}". 
              Include:
              1. A catchy title (max 60 chars).
              2. A compelling excerpt (max 150 chars).
              3. A detailed main content body (at least 300 words) with actionable tips. 
              
              CRITICAL: Format the "content" field using clean HTML tags (e.g., <p>, <h3>, <ul>, <li>, <strong>). 
              Return STRICTLY raw JSON. Do NOT wrap the output in markdown code blocks. 
              
              JSON keys must be exactly: "title", "excerpt", "content".`
            },
          ],
          temperature: 0.7,
          response_format: { type: "json_object" },
        });

        let rawContent = completion.choices[0].message.content || "{}";
        rawContent = rawContent.replace(/^```json\s*|\s*```$/g, "").trim();
        
        let parsedContent;
        try {
          parsedContent = JSON.parse(rawContent);
          console.log(`✅ [BLOG API] Successfully parsed JSON for: ${topic.title}`);
        } catch (parseError) {
          console.error(`❌ [BLOG API] JSON Parse Failed for: ${topic.title}`);
          console.error("Raw output was:", rawContent);
          parsedContent = {}; 
        }

        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 3));
        const finalSlug = topic.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        return {
          id: crypto.randomUUID(),
          title: parsedContent.title || topic.title,
          excerpt: parsedContent.excerpt || `Learn more about ${topic.title.toLowerCase()} with Bisoyin Confectionery & Catering.`,
          content: parsedContent.content || "<p>Expert tips and insights from the Bisoyin team.</p>",
          image: getImageUrl(topic.category),
          category: topic.category,
          date: date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
          readTime: `${Math.floor(Math.random() * 4) + 3} min read`,
          slug: finalSlug,
        };
      })
    );

    console.log("🎉 [BLOG API] Successfully returning generated posts!");
    return NextResponse.json({ posts: generatedPosts });
    
  } catch (error: any) {
    console.error("💥 [BLOG API] CRITICAL ERROR CAUGHT:", error.message);
    console.error("Full error object:", error);
    
    const searchParams = request.nextUrl.searchParams;
    const requestedSlug = searchParams.get("slug");
    
    let fallbackTopics;
    if (requestedSlug) {
      const found = topicPool.find(t => t.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === requestedSlug);
      fallbackTopics = found ? [found] : getRandomTopics(1);
    } else {
      fallbackTopics = getRandomTopics(6);
    }
    
    console.warn("⚠️ [BLOG API] Serving fallback posts due to error.");
    return NextResponse.json({ posts: getFallbackPosts(fallbackTopics) });
  }
}