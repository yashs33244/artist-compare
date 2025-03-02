import { NextResponse } from "next/server";
import Together from "together-ai";

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

async function generateInsights(artistName: string) {
  const prompt = `Generate 3 unique, insightful observations about music artist "${artistName}" that are not commonly known. Focus on their artistic impact, career trajectory, and industry influence. Format the response as a JSON array of strings, like this:
  
  ["Insight 1 about the artist.", "Insight 2 about their impact.", "Insight 3 about their significance."]
  
  Return ONLY the JSON array with no additional text.`;

  try {
    const result = await together.complete({
      prompt,
      model: "togethercomputer/llama-3-8b-instruct",
      max_tokens: 512,
      temperature: 0.7,
    });

    // Extract the JSON from the response
    const responseText = result.output.choices[0].text;
    const jsonMatch = responseText.match(/(\[[\s\S]*\])/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error("Unable to parse AI response as JSON");
  } catch (error) {
    console.error("Error generating insights:", error);
    
    // Default insights if AI generation fails
    return [
      `${artistName} has demonstrated remarkable versatility throughout their career.`,
      `Their unique sound has influenced many emerging artists in the industry.`,
      `Their commercial success is matched by critical acclaim and respect from peers.`
    ];
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const artist = searchParams.get("artist");
    
    if (!artist) {
      return NextResponse.json(
        { error: "No artist name provided" },
        { status: 400 }
      );
    }
    
    const insights = await generateInsights(artist);
    return NextResponse.json({ insights });
  } catch (error) {
    console.error("Error generating insights:", error);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}