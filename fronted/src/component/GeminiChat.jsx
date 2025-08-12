import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkEmoji from 'remark-emoji';
function GeminiChat() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    if (!input.includes('github.com')) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      
      const res = await fetch('http://localhost:5000/api/getRepoInfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: input }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();


      console.log(res.error);

      // Remove markdown code block wrappers if present
      const cleanMarkdown = data.bot.replace(/^```markdown\n|\n```$/g, '');
      setResponse(cleanMarkdown);
    } catch (err) {
      console.error("API Error:", err);
      setError(err.message || 'Failed to generate README');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>GitHub README Generator</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter GitHub repo URL (e.g., https://github.com/username/repo)"
          style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          disabled={isLoading}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: isLoading ? '#ccc' : '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </form>

      {error && (
        <div style={{ color: '#d32f2f', marginBottom: '15px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <div style={{
        border: '1px solid #eee',
        padding: '20px',
        borderRadius: '4px',
        minHeight: '300px',
        maxHeight: '500px',
        overflowY: 'auto',
        width: "100%",
        backgroundColor: 'black'
      }}>
        {response ? (
          <ReactMarkdown>
            {response || 'README will appear here'}
          </ReactMarkdown>
        ) : (
          <div style={{
            color: '#777',
            textAlign: 'center',
            padding: '50px 0',
            fontStyle: 'italic'
          }}>
            {isLoading ? 'Generating README...' : 'Generated README will appear here'}
          </div>
        )}
      </div>
    </div>
  );
}

export default GeminiChat;