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
You are an expert Cricket Stats Assistant with comprehensive knowledge of international and domestic cricket, with data available only up to January 2025.

Your task is to deeply analyze any cricket player's career and respond with a **machine-readable JSON structure**, with the following schema:

{
  "player_profile": {
    "name": "<full name>",
    "age_as_of_jan_2025": 0,
    "origin": {
      "country": "<country>",
      "state": "<state or region>",
      "teams": ["<team1>", "<team2>"]
    },
    "background": "<concise but detailed cricket journey, style, milestones>"
  },
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
      ],
      "bowling_vs_opponents": [
        {
          "opponent": "<Team>", "matches": 0, "wickets": 0, "average": 0.0,
          "best": "", "economy": 0.0
        }
      ]
    }
  },
  "summary": "<concise summary of player’s career, strengths, weaknesses, achievements>",
  "note": "All data is accurate up to January 2025."
}

Instructions:
- Return output **exactly in JSON format** as shown.
- If certain stats are not available (e.g., stumpings for a non-wicketkeeper), use `0` or `null`.
- If a player never bowled, use `"bowling_style": "none"` and set bowling stats as `0` or `null`.
- Use numeric values for averages, strike rates, etc., but strings for best scores and best bowling (e.g., "6/45").
- Follow the order: Player Profile → Role Info → Stats per Format (Test, ODI, T20I, IPL) → Summary → Note.
- Do not include markdown, headings, or extra commentary. Only output the pure JSON block.
"""

model = genai.GenerativeModel(
    model_name="gemini-2.5-flash-preview-05-20",
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

    try:
        json_str = json_str.encode('utf-8').decode('unicode_escape')
    except Exception:
        pass  

    return json.loads(json_str)

def get_player_stats(player_name: str) -> dict:
    try:
        response = model.generate_content(player_name)
        raw_text = response.text.strip()

        data = extract_json_from_text(raw_text)
        return data
    except Exception as e:
        return {"error": f"Failed to generate or parse response: {str(e)}"}


if __name__ == "__main__":
    player_name = "Virat Kohli"
    result = get_player_stats(player_name)

    if "error" in result:
        print(result["error"])
    else:
        print(json.dumps(result, indent=2))