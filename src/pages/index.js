import {Inter} from 'next/font/google'
import dynamic from 'next/dynamic';
import endent from 'endent';
import {useState} from 'react';
import Image from 'next/image';
import mypic from '../public/worqhatlogo.png';


const inter = Inter({subsets: ['latin']})

function homePage() {
    return (
        <main>
            <HomeComponents></HomeComponents>
        </main>
    )
}


const createPrompt = (inputLanguage, inputCode) => {
    return endent`
  You are an expert programmer in all programming languages. Translate the natural language to "${inputLanguage}" code. Do not include \\\\.

      Example translating from natural language to JavaScript:

      Natural language:
      Print the numbers 0 to 9.

  JavaScript code:
      for (let i = 0; i < 10; i++) {
          console.log(i);
      }

  Natural language:
      ${inputCode}

      ${inputLanguage} code (no \\\\):
  `;
};

async function fetchAIResponse(selectedLanguage, question) {
    const API_ENDPOINT = 'https://api.worqhat.com/api/ai/content/v2';

    const API_KEY = process.env.WORQHAT_API_KEY;
    const ORG_KEY = process.env.WORQHAT_ORG_KEY;

    console.log(API_KEY);

    const prompt = createPrompt(selectedLanguage, question);

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'x-org-key': ORG_KEY,
        },
        body: JSON.stringify({
            question: prompt,
            randomness: 0.4,
        }),
    };

    const response = await fetch(API_ENDPOINT, requestOptions);
    return await response.json();
}

const Editor = dynamic(() => import('@monaco-editor/react'), {ssr: false});


function HomeComponents() {
    const [generatedCode, setGeneratedCode] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerateCodeClick = async () => {

        const language = document.getElementById('language').value;
        const questionText = document.getElementById('textbox1').value;

        setLoading(true);
        setSelectedLanguage(language)

        let responseData = await fetchAIResponse(language, questionText);
        if (responseData?.status == 'success') {

            let responseCode = responseData?.content || '';
            if (responseCode.includes('```')) {
                responseCode = responseCode.split('```')[1];
                setGeneratedCode(responseCode);
                setLoading(false);
            } else {
                setGeneratedCode(`${responseCode}`);
                setLoading(false);
            }

        } else {
            setGeneratedCode('Sorry, we could not generate code for your question. Please try again.');
            setLoading(false);
        }
    };


    return (
        <div className="text-black">
            <h1 className="text-4xl md:text-5xl text-center mt-8 font-bold">Text to Code
                Generator</h1>
            <div className="text-center mt-8 text-xl md:text-2xl font-semibold">
                Generate Code from Natural Language using WorqHat AI in a Click!
            </div>

            <div className="container">
                <div className="mb-6">
                    <input type="text" id="textbox1" placeholder="Enter your Question here"
                           className="block mx-auto w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500">
                    </input>
                </div>
                <select id="language"
                        className="mx-auto mb-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4">
                    <option value="">Select language</option>
                    <option value="c++">C++</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="javascript">JavaScript</option>
                    <option value="c#">C#</option>
                    <option value="ruby">Ruby</option>
                    <option value="go">Go</option>
                    <option value="swift">Swift</option>
                    <option value="php">PHP</option>
                    <option value="typescript">TypeScript</option>
                    <option value="kotlin">Kotlin</option>
                    <option value="rust">Rust</option>
                    <option value="matlab">MATLAB</option>
                    <option value="r">R</option>
                    <option value="perl">Perl</option>
                    <option value="scala">Scala</option>
                    <option value="objective-c">Objective-C</option>
                    <option value="groovy">Groovy</option>
                    <option value="lua">Lua</option>
                    <option value="bash">Bash</option>
                    <option value="powershell">PowerShell</option>
                </select>

                <div className="w-full text-center">
                    <button id="generateButton"
                            className="mx-auto text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-xl px-5 py-2.5 text-center mr-2 mb-2"
                            onClick={handleGenerateCodeClick}>
                        {loading ? `Writing your Code ....` : 'Generate Code'}
                    </button>
                </div>

                <div className="edit">
                    <Editor
                        height="400px"
                        language={selectedLanguage}
                        theme="vs-dark"
                        defaultValue="// Generated code will appear here"
                        defaultLanguage="javascript"
                        value={generatedCode}
                        options={{
                            readOnly: true,
                            wordWrap: "wordWrapRow", // Enable word wrapping at a specific column
                            wordWrapRow: 10,
                        }}
                    />
                    <br/>
                </div>
            </div>

            <div className="text-center">
                <h2 className="text-center mt-6">Powered By</h2>
                <a href="https://worqhat.com">
                    <Image src={mypic} className="w-24 mx-auto" alt="WorqHat Logo"/>
                </a>
            </div>
            <div className="text-center my-6 text-black hover:text-blue-700 text-xl">
                <a href="https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20code%20Generator%20Tool%20using%20WorqHat%20AI!&url=https%3A%2F%2Fworqhat.com"
                   className="inline-flex">
                    Share on Twitter
                    <svg className="ml-2 my-auto" xmlns="http://www.w3.org/2000/svg" height="1em"
                         viewBox="0 0 512 512">
                        <path fill="currentColor"
                              d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/>
                    </svg>
                </a>
            </div>
        </div>
    );
}

export default homePage;
