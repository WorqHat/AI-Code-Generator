import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import endent from "endent";
import { useState } from "react";
import Image from "next/image";
import mypic from "../public/worqhatlogo.png";

const inter = Inter({ subsets: ["latin"] });

function homePage() {
  return (
    <main>
      <HomeComponents></HomeComponents>
    </main>
  );
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
  const API_ENDPOINT = "https://api.worqhat.com/api/ai/content/v2";
  const BEARER_TOKEN = `Bearer ${process.env.WORQHAT_API_KEY}`;

  const prompt = createPrompt(selectedLanguage, question);

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: BEARER_TOKEN,
    },
    body: JSON.stringify({
      question: prompt,
      randomness: 0.4,
    }),
  };

  const response = await fetch(API_ENDPOINT, requestOptions);
  return await response.json();
}

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

function HomeComponents() {
  const [generatedCode, setGeneratedCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateCodeClick = async () => {
    const language = document.getElementById("language").value;
    const questionText = document.getElementById("textbox1").value;

    setLoading(true);
    setSelectedLanguage(language);

    let responseData = await fetchAIResponse(language, questionText);
    if (responseData?.status == "success") {
      let responseCode = responseData?.content || "";
      if (responseCode.includes("```")) {
        responseCode = responseCode.split("```")[1];
        setGeneratedCode(responseCode);
        setLoading(false);
      } else {
        setGeneratedCode(`${responseCode}`);
        setLoading(false);
      }
    } else {
      setGeneratedCode(
        "Sorry, we could not generate code for your question. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="text-black">
      <div
        className="text-center"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <h2 className="text-center mt-6">Powered By</h2>
        <a href="https://worqhat.com">
          <Image src={mypic} className="w-24 mx-auto" alt="WorqHat Logo" />
        </a>
      </div>

      <h1 className="text-4xl md:text-5xl text-center mt-8 font-bold">
        Text to Code Generator
      </h1>
      <div className="text-center mt-8 text-xl md:text-2xl font-semibold">
        Generate Code from Natural Language using WorqHat AI in a Click!
      </div>

      <div className="container">
        <div className="mb-6">
          <input
            type="text"
            id="textbox1"
            placeholder="Enter your Question here"
            className="block mx-auto w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
          ></input>
        </div>
        <select
          id="language"
          className="mx-auto mb-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
        >
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
          <button
            id="generateButton"
            className="mx-auto text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-xl px-5 py-2.5 text-center mr-2 mb-2"
            onClick={handleGenerateCodeClick}
          >
            {loading ? `Writing your Code ....` : "Generate Code"}
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
          <br />
        </div>
      </div>

      
      <div
        className="footer"
        style={{
          textAlign: "center",
          marginTop: "-30px",
          left: "0",
          bottom: "10px",
          width: "100%",
        }}
      >
        <p>
          &copy; 2023{" "}
          <a
            href="https://www.worqhat.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "blue" }}
          >
            Worqhat
          </a>
          . All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default homePage;
