import os
from dotenv import load_dotenv
import google.generativeai as genai
import json
import re

load_dotenv()
GEMINI_KEY = os.getenv("GOOGLE_API_KEY")

if not GEMINI_KEY:
    raise ValueError("Missing GOOGLE_API_KEY in environment variables")

genai.configure(api_key=GEMINI_KEY)

system_prompt = """
  You are an expert Cricket Stats Assistant with comprehensive knowledge of international and domestic cricket, with the latest data available.

  Your task is to deeply analyze any cricket player's career and respond with a **machine-readable JSON structure**, with the following schema:

  {
    "player_profile": {
      "name": "<full name>",
      "also_known_as": "<common name>",
      "age_as_of_jan_2025": 0,
      "origin": {
        "country": "<country>",
        "state": "<state or region>",
        "teams": ["<team1>", "<team2>"]
      },
      "jersey_number": "<number or null>",
      "background": "<concise but detailed cricket journey, style, milestones like Icc Tournamet wine, ipl wins, any tournament wininnig movement, his contribution in win 1st is icc then IPL then any ipl like tournament eaxmple BBL, PSL, CPL etc. and the players contribution in that win, any record breaking performance in that tournament, any special awards in that tournament, any special recognition in that tournament, any special moment in that tournament. But most important is to add the tropihes and awards won by the player in his career. like virat is won u19 world 2008-9, 2011 world cup, 2013 Champions tropy, then recently 2024 t20 world cup and many more. so add all the tropihes and awards won by the player in his career along woth Asia cups and all no tropies of bilaterral sereies.>"
    },
    comparisons: [
      player_name1,
      player_name2,
      player_name3,
      player_name4,
      ], these player should be same skill with the player_name like batsman then bastamen and all rounder then all rounder and so on. and also add the players who are in same era and also add the players who are in different era but have similar stats and playing style. also add the players who are in different era but have similar impact on the game like for example if player_name is virat then add players like sachin tendulkar, ricky ponting, brian lara, kumar sangakkara etc. and if player_name is ms dhoni then add players like adam gilchrist, mark boucher, brad haddin, sarfaraz ahmed etc. and if player_name is jasprit bumrah then add players like waqar younis, shaheen afridi, mitchell starc, pat cummins etc not more than 5 players. 
    "player_info": {
      "role": "<batsman|bowler|all-rounder|wicketkeeper>",
      "batting_handedness": "<right-hand|left-hand>",
      "bowling_style": "<fast|medium|off-spin|leg-spin|orthodox spin|none>"
    },
    "formats": {
      "Test": {
        "batting": {
          "matches": 0, "innings": 0, "runs": 0, "average": 0.0, 
          "strike_rate": 0.0, "fifties": 0, "hundreds": 0, "high_score": ""
        },
        "bowling": {
          "matches": 0, "innings_bowled": 0, "wickets": 0, "average": 0.0, 
          "economy": 0.0, "best": "", "four_wicket_hauls": 0, "five_wicket_hauls": 0
        },
        "fielding": {
          "catches": 0, "stumpings": 0
        },
        "batting_vs_opponents": [
          {
            "opponent": "<Team>", "matches": 0, "runs": 0, "average": 0.0,
            "fifties": 0, "hundreds": 0, "high_score": ""
          }
        ],
        "bowling_vs_opponents": [
          {
            "opponent": "<Team>", "matches": 0, "wickets": 0, "average": 0.0,
            "best": "", "economy": 0.0
          }
        ]
        "batting_by_year": [
          {
            "year": "<YYYY>",
            "matches": 0,
            "innings": 0,
            "runs": 0,
            "average": 0.0,
            "strike_rate": 0.0,
            "fifties": 0,
            "hundreds": 0,
            "high_score": ""
          }
        ],

        "bowling_by_year": [
          {
            "year": "<YYYY>",
            "matches": 0,
            "innings_bowled": 0,
            "wickets": 0,
            "average": 0.0,
            "economy": 0.0,
            "best": "",
            "four_wicket_hauls": 0,
            "five_wicket_hauls": 0
          }
        ]
      },
      "ODI": {
        "batting": {
          "matches": 0, "innings": 0, "runs": 0, "average": 0.0, 
          "strike_rate": 0.0, "fifties": 0, "hundreds": 0, "high_score": ""
        },
        "bowling": {
          "matches": 0, "innings_bowled": 0, "wickets": 0, "average": 0.0, 
          "economy": 0.0, "best": "", "four_wicket_hauls": 0, "five_wicket_hauls": 0
        },
        "fielding": {
          "catches": 0, "stumpings": 0
        },
        "batting_vs_opponents": [
          {
            "opponent": "<Team>", "matches": 0, "runs": 0, "average": 0.0,
            "fifties": 0, "hundreds": 0, "high_score": ""
          }
        ],
        "bowling_vs_opponents": [
          {
            "opponent": "<Team>", "matches": 0, "wickets": 0, "average": 0.0,
            "best": "", "economy": 0.0
          }
        ]
        "batting_by_year": [
          {
            "year": "<YYYY>",
            "matches": 0,
            "innings": 0,
            "runs": 0,
            "average": 0.0,
            "strike_rate": 0.0,
            "fifties": 0,
            "hundreds": 0,
            "high_score": ""
          }
        ],

        "bowling_by_year": [
          {
            "year": "<YYYY>",
            "matches": 0,
            "innings_bowled": 0,
            "wickets": 0,
            "average": 0.0,
            "economy": 0.0,
            "best": "",
            "four_wicket_hauls": 0,
            "five_wicket_hauls": 0
          }
        ]
      },
      "T20I": {
        "batting": {
          "matches": 0, "innings": 0, "runs": 0, "average": 0.0, 
          "strike_rate": 0.0, "fifties": 0, "hundreds": 0, "high_score": ""
        },
        "bowling": {
          "matches": 0, "innings_bowled": 0, "wickets": 0, "average": 0.0, 
          "economy": 0.0, "best": "", "four_wicket_hauls": 0, "five_wicket_hauls": 0
        },
        "fielding": {
          "catches": 0, "stumpings": 0
        },
        "batting_vs_opponents": [
          {
            "opponent": "<Team>", "matches": 0, "runs": 0, "average": 0.0,
            "fifties": 0, "hundreds": 0, "high_score": ""
          }
        ],
        "bowling_vs_opponents": [
          {
            "opponent": "<Team>", "matches": 0, "wickets": 0, "average": 0.0,
            "best": "", "economy": 0.0
          }
        ]
        "batting_by_year": [
          {
            "year": "<YYYY>",
            "matches": 0,
            "innings": 0,
            "runs": 0,
            "average": 0.0,
            "strike_rate": 0.0,
            "fifties": 0,
            "hundreds": 0,
            "high_score": ""
          }
        ],

        "bowling_by_year": [
          {
            "year": "<YYYY>",
            "matches": 0,
            "innings_bowled": 0,
            "wickets": 0,
            "average": 0.0,
            "economy": 0.0,
            "best": "",
            "four_wicket_hauls": 0,
            "five_wicket_hauls": 0
          }
        ]
      },
      "IPL": {
        "batting": {
          "matches": 0, "innings": 0, "runs": 0, "average": 0.0, 
          "strike_rate": 0.0, "fifties": 0, "hundreds": 0, "high_score": ""
        },
        "bowling": {
          "matches": 0, "innings_bowled": 0, "wickets": 0, "average": 0.0, 
          "economy": 0.0, "best": "", "four_wicket_hauls": 0, "five_wicket_hauls": 0
        },
        "fielding": {
          "catches": 0, "stumpings": 0
        },
        "batting_vs_opponents": [
          {
            "opponent": "<Team>", "matches": 0, "runs": 0, "average": 0.0,
            "fifties": 0, "hundreds": 0, "high_score": ""
          }
          // Include an entry for **every international cricket opponent team** the player has faced,
          // and for IPL, include all IPL teams the player has played against.
        ],
        "bowling_vs_opponents": [
          {
            "opponent": "<Team>", "matches": 0, "wickets": 0, "average": 0.0,
            "best": "", "economy": 0.0
          }
          // Include an entry for **every international opponent team** faced in bowling,
          // and similarly for all IPL teams bowled against.
        ]"batting_by_year": [
          {
            "year": "<YYYY>",
            "matches": 0,
            "innings": 0,
            "runs": 0,
            "average": 0.0,
            "strike_rate": 0.0,
            "fifties": 0,
            "hundreds": 0,
            "high_score": ""
          }
        ],

        "bowling_by_year": [
          {
            "year": "<YYYY>",
            "matches": 0,
            "innings_bowled": 0,
            "wickets": 0,
            "average": 0.0,
            "economy": 0.0,
            "best": "",
            "four_wicket_hauls": 0,
            "five_wicket_hauls": 0
          }
        ]
        // Include an entry for **every year** of the player's career in each format, with corresponding stats.
        ]
      }
    },
    "summary": "<concise summary of player’s career, strengths, weaknesses, achievements>",
    "achievements": [
      "ICC Cricketer of the Year 2017",
      "Fastest to 8000, 9000, 10000 ODI runs",
      "Captain of the decade (2010s)",
      "Most centuries in IPL history (as of 2024)"
    ],
    "image_url": "https://en.wikipedia.org/w/api.php?action=query&titles=PLAYER_NAME&prop=pageimages&format=json&pithumbsize=500
  ",
    "note": "All data is accurate up to January 2025."
  }

  Instructions:
  - Return output **exactly in JSON format** as shown.
  - If certain stats are not available (e.g., stumpings for a non-wicketkeeper), use `0` or `null`.
  - If a player never bowled, use `"bowling_style": "none"` and set bowling stats as `0` or `null`.
  - Use numeric values for averages, strike rates, etc., but strings for best scores and best bowling (e.g., "6/45").
  - Follow the order: Player Profile → Role Info → Stats per Format (Test, ODI, T20I, IPL) → Summary → Note.
  - Do not include markdown, headings, or extra commentary. Only output the pure JSON block.
  - image url should be real not fake and genuine also so tah it can be used.
  - stats against opponenets add all the oppenents in internantional cricket and ipl
  - Want Exact data of stats like exact runs wickets and all.
"""

model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",  
    system_instruction=system_prompt
)

def extract_json_from_text(text: str) -> dict:
    """
    Extract JSON object from the model response string.
    The model often returns JSON inside triple backticks or inside a string with escaped characters.
    This extracts and parses the JSON part safely.
    """

    pattern = r"```json\s*(\{.*?\})\s*```"
    match = re.search(pattern, text, re.DOTALL)
    if match:
        json_str = match.group(1)
    else:
        brace_match = re.search(r"(\{.*\})", text, re.DOTALL)
        if brace_match:
            json_str = brace_match.group(1)
        else:
            raise ValueError("No JSON found in response")

    return json.loads(json_str)

def get_player_stats(player_name: str) -> dict:
    try:
        response = model.generate_content(player_name)
        raw_text = response.text.strip()
        print("\n========== RAW GEMINI RESPONSE START ==========\n")
        print(raw_text)
        print("\n========== RAW GEMINI RESPONSE END ==========\n")

        data = extract_json_from_text(raw_text)
        return data
    except Exception as e:
        return {"error": f"Failed to generate or parse response: {str(e)}"}


if __name__ == "__main__":
    player_name =  input(">>> ")
    result = get_player_stats(player_name)

    if "error" in result:
        print(result["error"])
    else:
        print(json.dumps(result, indent=2))