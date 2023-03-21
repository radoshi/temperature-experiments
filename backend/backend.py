import asyncio
import logging
import os

import quart
from langchain.llms import OpenAI

app = quart.Quart(__name__)

# Get the OpenAI API key from an environment variable
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

TEMPERATURES = [0.0, 0.5, 0.9]

LLMS = [
    OpenAI(openai_api_key=OPENAI_API_KEY, temperature=temperature)
    for temperature in TEMPERATURES
]


@app.route("/", methods=["GET", "POST"])
async def index():
    # return index.html from templates if this is a get request
    if quart.request.method == "GET":
        return await quart.render_template("index.html")

    # unpack form data
    data = await quart.request.form
    prompt = data.get("prompt")
    if prompt is None:
        return await quart.render_template("index.html", error="No prompt provided")

    # Fetch 3 responses at different temperatures from OpenAi
    responses = await get_responses(prompt)

    # return index.html with the responses
    return await quart.render_template("index.html", prompt=prompt, responses=responses)


def get_single_response(llm, prompt):
    logging.info(f"Generating response at temperature {llm.temperature}")
    return llm(prompt)


async def get_responses(prompt):
    return await asyncio.gather(
        *(asyncio.to_thread(get_single_response, llm, prompt) for llm in LLMS)
    )


@app.route("/api")
async def api():
    # receive arguments as a josn object
    args = await quart.request.json

    # JSON object structure
    # {
    # "prompt": "This is a prompt",
    # }
    prompt = args.get("prompt")
    if prompt is None:
        return await quart.jsonify(
            {"status": "error", "message": "No prompt provided", "responses": []}
        )

    # Fetch 3 responses at different temperatures from OpenAi
    # and return them as a JSON object
    responses = asyncio.run(get_responses(prompt))

    # return a json object
    return await quart.jsonify({"status": "success", "responses": responses})


if __name__ == "__main__":
    app.run(debug=True)
