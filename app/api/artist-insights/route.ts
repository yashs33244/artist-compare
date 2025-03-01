import { type NextRequest, NextResponse } from "next/server";
import Together from "together-ai";

// Initialize Together AI client
const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    const { artistName } = await request.json();
    
    if (!artistName) {
      return NextResponse.json({ error: "Artist name is required" }, { status: 400 });
    }
    
    const response = await together.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert music industry analyst with deep knowledge of artists' careers, commercial success, and industry impact. Provide detailed, factual insights in JSON format."
        },
        {
          role: "user",
          content: `Analyze ${artistName}'s career and provide detailed metrics on: net worth, earnings per performance, career achievements, global influence, awards & recognition, collaborations, music genre impact, commercial success, and longevity in the industry. Format the response as a JSON object with these categories as keys and detailed analysis as values.`
        }
      ],
      model: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
      max_tokens: 1000,
      temperature: 0.3, // Lower temperature for more factual responses
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1,
      stop: ["<｜end▁of▁sentence｜>"]
    });
    
    // Extract the content from Together AI response
    const aiContent = response.choices[0]?.message?.content || "{}";
    
    // Parse the JSON response
    let insights = {};
    try {
      // Try to extract JSON from the response which might contain explanatory text
      const jsonMatch = aiContent.match(/\{.*\}/s);
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback to parsing the whole response
        insights = JSON.parse(aiContent);
      }
    } catch (e) {
      // If parsing fails, return the raw text
      return NextResponse.json({ 
        insights: aiContent,
        error: "Could not parse structured data" 
      });
    }
    
    return NextResponse.json({ insights });
  } catch (error) {
    console.error("Error generating artist insights:", error);
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 });
  }
}