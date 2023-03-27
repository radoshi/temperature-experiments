# temperature-experiments

Experiments with OpenAI and temperature.

## Project structure

`backend` contains a simple flask app to serve an API.
`vite-frontend` is a simple react frontend.

## Build instructions

### Development

```
# Init python env
pip install -r requirements.txt
source venv/bin/activate

# Set OPENAI_API_KEY
export OPENAI_API_KEY="sk-...."

# Start quart on 8080
python backend/backend.py

# Start the frontend on 5173
cd vite-frontend
npm install
npm run dev
```

### Deployment

```
# Generate a build into backend/static
cd vite-frontend
npx vite build --base=/static/

# Checkin and push
git commit -m "new build"
git push

# Autodeploy on render
```

## Learnings

1. Mixing stacks (python + react) is annoying. I spent more time sorting through this element than building the actual project.
2. Vite to the rescue. Why mess with all the other stuff. This tool is great.
3. `temperature=2` causes significant hallucinations.
