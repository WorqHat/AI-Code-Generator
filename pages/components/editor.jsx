import { useEffect } from 'react';
import { Editor } from '@monaco-editor/react';

export default function CodeEditor({ editorRef }) {
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);
  return (
    <Editor
      height="40vh"
      fontSize="60px"
      width="100%"
      theme="vs-dark"
      defaultLanguage="python"
      ref={editorRef}
      margin="auto"
      options={{
        readOnly: true,
        wordWrap: "wordWrapRow", // Enable word wrapping at a specific column
        wordWrapRow: 10,
      }}
    />
  );
}
