import { useEffect, useState, useRef } from 'react';
import '../app/globals.css';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import mypic from '../public/worqhatlogo.png';

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

export default function Home() {
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
    <div className="container">
      <h1>Text to Code Generator</h1>
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
      <div>
        <h2>By</h2>
        <a href="https://worqhat.com">
          <Image src={mypic} alt="Picture of the author" />
        </a>
      </div>
    </div>
  );
}
