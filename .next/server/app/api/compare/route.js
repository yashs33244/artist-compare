"use strict";(()=>{var e={};e.id=90,e.ids=[90],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},55315:e=>{e.exports=require("path")},68621:e=>{e.exports=require("punycode")},76162:e=>{e.exports=require("stream")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},6162:e=>{e.exports=require("worker_threads")},71568:e=>{e.exports=require("zlib")},87561:e=>{e.exports=require("node:fs")},84492:e=>{e.exports=require("node:stream")},72477:e=>{e.exports=require("node:stream/web")},52297:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>f,patchFetch:()=>w,requestAsyncStorage:()=>d,routeModule:()=>m,serverHooks:()=>g,staticGenerationAsyncStorage:()=>h});var a={};t.r(a),t.d(a,{GET:()=>u});var s=t(22060),o=t(72433),i=t(10137),n=t(16097);let c=new(t(88721)).ZP({apiKey:process.env.TOGETHER_API_KEY});async function p(){let e=process.env.SPOTIFY_CLIENT_ID,r=process.env.SPOTIFY_CLIENT_SECRET,t=await fetch("https://accounts.spotify.com/api/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded",Authorization:`Basic ${Buffer.from(`${e}:${r}`).toString("base64")}`},body:"grant_type=client_credentials"});if(!t.ok)throw Error("Failed to fetch Spotify access token");return(await t.json()).access_token}async function l(e,r){let t=await fetch(`https://api.spotify.com/v1/artists/${e}`,{headers:{Authorization:`Bearer ${r}`}});if(!t.ok)throw Error(`Failed to fetch details for artist ${e}`);return await t.json()}async function u(e){let r=new URL(e.url).searchParams,t=r.get("artists")?.split(",")||[];if(0===t.length)return n.NextResponse.json({error:"Artist IDs are required"},{status:400});try{let e=await p(),r=await Promise.all(t.map(r=>l(r,e))),a=r.map(e=>({name:e.name,popularity:e.popularity,followers:e.followers.total,genres:e.genres.join(", "),imageUrl:e.images[0]?.url||"/placeholder.svg"})),s=await c.chat.completions.create({messages:[{role:"system",content:`You are an expert music industry analyst with deep knowledge of artists' careers, commercial success, and industry impact. 
          
          You need to provide detailed, factual insights in a strictly parseable JSON format. Include source links for all major data points. 
          
          Your response MUST follow this exact format without any markdown or additional text:
          
          {
            "artists": {
              "[artistName]": {
                "net_worth": number,
                "earnings_per_performance": number,
                "career_achievements": {
                  "hits": number,
                  "milestones": "string description"
                },
                "global_influence": number,
                "awards_recognition": number,
                "collaborations": number,
                "genre_impact": number,
                "commercial_success": number,
                "longevity": number,
                "insights": "Detailed paragraph about the artist's career and impact",
                "sources": {
                  "net_worth": "URL",
                  "earnings": "URL",
                  "awards": "URL",
                  "streaming": "URL"
                }
              }
            }
          }
          
          Make sure the entire response is valid JSON without any explanations, markdown or text outside the JSON structure.`},{role:"user",content:`Analyze and compare the following artists based on their Spotify data: ${JSON.stringify(a)}. 
          
          Provide detailed metrics on: 
          - net worth (in millions USD)
          - earnings per performance (in thousands USD)
          - career achievements (number of hits and descriptive milestones)
          - global influence (on a scale of 1-10)
          - awards & recognition (number of awards)
          - collaborations (number of notable collaborations)
          - music genre impact (number of genres influenced)
          - commercial success (total streams in billions)
          - longevity in the industry (years active)
          
          For each artist, also provide:
          1. A detailed paragraph of insights about their career trajectory and industry impact
          2. Source URLs for each major data point (net worth, earnings, awards, streaming numbers)
          
          Format the response as a valid JSON object with the exact structure specified in the system message.`}],model:"deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",max_tokens:2e3,temperature:.2,top_p:.95,top_k:40,repetition_penalty:1.03}),o=s.choices[0]?.message?.content||"{}",i={};try{try{i=JSON.parse(o)}catch(r){let e=o.match(/\{[\s\S]*\}/);if(e){let r=e[0].replace(/```json|```/g,"").trim();i=JSON.parse(r)}else throw Error("Could not extract valid JSON")}if(!i.artists)throw Error("Missing artists data in response")}catch(t){console.error("Error parsing AI response:",t);let e=a.map(e=>e.name),r={artists:{}};return e.forEach(e=>{r.artists[e]={net_worth:0,earnings_per_performance:0,career_achievements:{hits:0,milestones:"Information unavailable"},global_influence:0,awards_recognition:0,collaborations:0,genre_impact:0,commercial_success:0,longevity:0,insights:"We couldn't retrieve detailed information for this artist.",sources:{general:"https://www.billboard.com/"}}}),n.NextResponse.json({artists:a,insights:r,parsing_error:!0,raw_content:o.substring(0,500)+"..."})}return n.NextResponse.json({artists:a,insights:i,spotify_data:r.map(e=>({name:e.name,popularity:e.popularity,followers:e.followers.total,genres:e.genres}))})}catch(e){return console.error("Error comparing artists:",e),n.NextResponse.json({error:"Failed to compare artists",details:e.message},{status:500})}}let m=new s.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/compare/route",pathname:"/api/compare",filename:"route",bundlePath:"app/api/compare/route"},resolvedPagePath:"/Users/tanishqsingh/Downloads/artist-comparison-app/app/api/compare/route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:d,staticGenerationAsyncStorage:h,serverHooks:g}=m,f="/api/compare/route";function w(){return(0,i.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:h})}}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),a=r.X(0,[461,582,721],()=>t(52297));module.exports=a})();