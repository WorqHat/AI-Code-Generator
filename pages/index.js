import { useEffect, useState, useRef } from 'react';
import '../app/globals.css';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import mypic from '../public/worqhatlogo.png';
import Head from 'next/head';

function HomePage() {
    return (
        <div>
            <Head>
                <title>My Next.js App - Home</title>
                <meta name="description" content="Welcome to my Next.js application!" />
            </Head>

            <Home />
        </div>
    );
}


const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

async function fetchAIResponse(selectedLanguage, question) {
  const API_ENDPOINT = 'https://api.worqhat.com/api/ai/content/v2';
  const API_KEY = 'U2FsdGVkX187FPQxzgbmIVjXh3O1+xyor30KWVrIBMuFEqGv8NfzXPjE53e3Ju+T';
  const ORG_KEY = 'U2FsdGVkX19lq3bhhF5TRouMiyL2HvEBD2V5j5nNl6dNL9JWPbsXW0rqlzssW8GieFki6oRVDKTb/z01Hc7m+Q==';

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'x-org-key': ORG_KEY,
    },
    body: JSON.stringify({
      question,
      preserve_history: true,
      history_object: {
        'Selected Language': selectedLanguage,
      },
      randomness: 0.4,
    }),
  };

  const response = await fetch(API_ENDPOINT, requestOptions);
  const data = await response.json();
  return data;
}

function SelLanguage({ selectedLanguage }) {
  const [response, setResponse] = useState('');
  const editorRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const responseData = await fetchAIResponse(selectedLanguage, '');
      setResponse(responseData.content);
      editorRef.current?.setValue(responseData.content);
    }
    fetchData();
  }, [selectedLanguage]);

  return (
    <div>
      <br />
      <br></br>
      {/* <h1>Generation Complete</h1> */}
      <h2>Selected Language: {selectedLanguage}</h2>
    </div>
  );
}

function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [enteredText, setEnteredText] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateCodeClick = async () => {
    const language = document.getElementById('language').value;
    const textBoxValue = document.getElementById('textbox1').value;

    setSelectedLanguage(language);
    setEnteredText(textBoxValue);
    setLoading(true);

    const responseData = await fetchAIResponse(language, textBoxValue);
    setGeneratedCode(responseData?.content || '');
    setLoading(false);
  };

  return (
      <div className="text-black">
        <h1 className="text-4xl md:text-5xl text-center mt-8">Text to Code Generator</h1>
        <div className="text-center mt-8 text-xl md:text-2xl">
          Generate Code from Natural Language using WorqHat AI in a Click!
        </div>

        <div className="container">
      <input type="text" id="textbox1" className="input-animation" placeholder="Enter your text" />
      <div>
        <select id="language" className="select-animation">
          <option value="">Select language</option>
          <option value="c++">c++</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
          <option value="php">PHP</option>
          <option value="english">English</option>
        </select>
      </div>
      <button id="generateButton" onClick={handleGenerateCodeClick}>
        {loading ? 'Generating...' : 'Generate Code'}
      </button>

      {selectedLanguage && <SelLanguage selectedLanguage={selectedLanguage} />}
      <div className="edit">
        <Editor
          height="400px"
          language="javascript"
          theme="vs-dark"
          defaultValue="// Generated code will appear here"
          defaultLanguage="javascript"
          value={generatedCode}
          options={{
            readOnly: true,
          }}
        />
        <br />
      </div>
    </div>
        <div>
          <h2  className="text-center mt-6">Powered By</h2>
          <a href="https://worqhat.com">
            <Image src={mypic} className="w-24" alt="WorqHat Logo" />
          </a>
        </div>
        <div className="text-center mt-6 text-black hover:text-blue-700">
          <a href="https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20code%20Generator%20Tool%20using%20WorqHat%20AI!&url=https%3A%2F%2Fworqhat.com" className="inline-flex">
            Share on Twitter
            <svg className="ml-2 my-auto" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/></svg>
          </a>
        </div>
      </div>
  );
}

export default HomePage;
