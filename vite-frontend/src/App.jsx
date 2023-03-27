import { useState } from 'react';

function TabbedList({ responses }) {
  const [state, setState] = useState(0);

  if (!responses) {
    return <div></div>;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-row mt-2 justify-between w-full">
        {responses.map(({ response, temperature }, i) => (
          <button
            key={temperature}
            className={`focus:outline-none w-full py-2 rounded-t-lg ${
              state === i ? 'bg-gray-100' : ''
            }`}
            onClick={() => setState(i)}
          >
            {temperature}
          </button>
        ))}
      </div>
      <div className="bg-gray-100 p-2 rounded-b-lg">{responses[state].response}</div>
    </div>
  );
}

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState();

  // const API = process.env.NODE_ENV === 'development' ? 'http://localhost:8080/api' : '/api';
  const API = '/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(prompt);

    setResponses([{ response: 'Loading...', temperature: '' }]);

    const response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ prompt: prompt }),
    });

    const data = await response.json();
    console.log(data);
    if (data.status === 'success') {
      console.log('success');
      setResponses(data.responses);
    } else {
      console.log(`error: ${data.message}`);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-blue-100 flex justify-center">
        <div className="max-w-xxl w-full flex items-start justify-center pt-12 px-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-4xl font-bold p-2 text-center">Temperature</h1>
            <p className="text-gray-500 p-2 mb-4 text-center">
              Experiments with OpenAI's GPT-3.5-turbo. Explore the same prompt at different
              temperature settings.
            </p>
            <form
              className="mt-8 space-y-2 mb-4"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                id="prompt"
                value={prompt}
                placeholder="Enter a prompt"
                onChange={(e) => setPrompt(e.target.value)}
                className="border-2 border-gray-300 p-2 rounded-lg w-full"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-lg w-full"
              >
                Submit
              </button>
            </form>
            <TabbedList responses={responses} />
          </div>
        </div>
      </div>
    </>
  );
}
