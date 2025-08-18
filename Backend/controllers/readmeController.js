const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const repoInfo = async (req, res) => {
    const { repoUrl } = req.body;

    try {
        if (!repoUrl) {
            return res.status(400).json({ error: "Repository URL is required" });
        }

        // Clean and parse URL
        const cleanUrl = repoUrl.replace(/\.git$/, "");
        const parts = cleanUrl.split("/");
        const owner = parts[parts.length - 2];
        const repo = parts[parts.length - 1];
        const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;
        console.log("Base URL:", baseUrl);

        const headers = {
            "User-Agent": "repo-info-app",
            "Accept": "application/vnd.github+json",
            "Authorization": `token ${process.env.GITHUB_TOKEN}`
        };
        // Fetch repository data
        console.log("Base URL:", baseUrl);
        const [repoRes, langRes, contribRes] = await Promise.all([
            fetch(baseUrl),
            fetch(`${baseUrl}/languages`),
            fetch(`${baseUrl}/contributors`)
        ]);

        if (!repoRes.ok) {
            console.log("Repository not found:", repoUrl);
            return res.status(404).json({ error: "Repository not found" });
        }

        if (!contribRes.ok || !langRes.ok) {
            res.status(500).json({ error: "Failed to fetch repository details" });
        }


        const [repoData, languages, contributors] = await Promise.all([
            repoRes.json(),
            langRes.json(),
            contribRes.json()
        ]);

        const languagesList = Object.keys(languages).join(", ");

        // Generate prompt
        // const prompt = `
        // You are a professional technical writer and GitHub README specialist.

        // Given the following GitHub repository information, create a comprehensive, well-structured, and attractive README.md file. The README should include:

        // - Project Title with emoji
        // - Badges (stars, license, language)
        // - Table of Contents
        // - Description
        // - Features
        // - Installation instructions
        // - Usage instructions
        // - Languages used
        // - License section
        // - Contributors
        // - Repository statistics
        // - How to contribute
        // - Contact/support info

        // Repository Data:
        // Name: ${repoData.name || "N/A"}
        // Description: ${repoData.description || "No description provided"}
        // URL: ${repoData.html_url || "N/A"}
        // Languages: ${languagesList || "N/A"}
        // License: ${repoData.license?.name || "No license"} (${repoData.license?.spdx_id || "N/A"})
        // Stars: ${repoData.stargazers_count || 0}
        // Watchers: ${repoData.watchers_count || 0}
        // Forks: ${repoData.forks_count || 0}
        // Open Issues: ${repoData.open_issues_count || 0}
        // Size: ${repoData.size || "N/A"} KB
        // Created: ${repoData.created_at || "N/A"}
        // Updated: ${repoData.updated_at || "N/A"}
        // Topics: ${repoData.topics?.join(", ") || "None"}
        // Contributors:
        // ${contributors.map(c => `- [${c.login}](${c.html_url}) (${c.contributions} contributions)`).join("\n")}

        // ## Installation

        // To install the project dependencies, follow these steps:

        // \`\`\`bash
        // # Clone the repository
        // git clone https://github.com/${owner}/${repo}.git

        // # Navigate into the project directory
        // cd ${repo}

        // # Install dependencies
        // npm install

        // # Start the application
        // npm start
        // \`\`\`

        // *Note: Replace \`npm\` commands with appropriate package manager commands if needed.*

        // Generate professional markdown with emojis, proper formatting, and mobile-responsive design.
        // Please ensure the README is clear, concise, and beginner-friendly. 


        // `;

        const prompt = `
You are a professional technical writer and GitHub README specialist.

This is the repository URL: ${repoUrl}

Please review the repository data below carefully and generate a README customized to the project type.  
Whether the project is technical or non-technical, tailor the README accordingly.  
Make sure the README is clear, concise, and suitable for users of all backgrounds.

Given the following GitHub repository information, create a comprehensive, well-structured, and attractive README.md file. The README should include:
Use markdown best practices, add badges with shields.io style, and provide example commands in Usage and Features sections. Use emojis appropriately to enhance readability:

- Project Title with emoji
- Badges (stars, license, language)
- Table of Contents
- Description
- Features
- Installation instructions
- Usage instructions
- Languages used
- License section
- Contributors
- Repository statistics
- How to contribute
- Contact/support info

Repository Data:
Name: ${repoData.name || "N/A"}
Description: ${repoData.description || "No description provided"}
URL: ${repoData.html_url || "N/A"}
Languages: ${languagesList || "N/A"}
License: ${repoData.license?.name || "No license"} (${repoData.license?.spdx_id || "N/A"})
Stars: ${repoData.stargazers_count || 0}
Watchers: ${repoData.watchers_count || 0}
Forks: ${repoData.forks_count || 0}
Open Issues: ${repoData.open_issues_count || 0}
Size: ${repoData.size || "N/A"} KB
Created: ${repoData.created_at || "N/A"}
Updated: ${repoData.updated_at || "N/A"}
Topics: ${repoData.topics?.join(", ") || "None"}
Contributors:
${contributors.map(c => `- [${c.login}](${c.html_url}) (${c.contributions} contributions)`).join("\n")}

## Installation

To install the project dependencies, follow these steps:

\`\`\`bash
# Clone the repository
git clone https://github.com/${owner}/${repo}.git

# Navigate into the project directory
cd ${repo}

# Install dependencies
npm install

# Start the application
npm start
\`\`\`

*Note: Replace \`npm\` commands with appropriate package manager commands if needed.*

Generate professional markdown with emojis, proper formatting, and mobile-responsive design.
Dont't forget to write my name at the end of the README as "Made with ❤️ by Gulzar alice"
`;


        // Generate README with Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
        const result = await model.generateContent(prompt);
        const markdown = await result.response.text();
        const reply = markdown.replace(/^```(?:markdown)?\n/, '').replace(/\n```$/, '');

        return res.status(200).json({
            message: "Success",
            repoUrl,
            prompt,
            bot: reply,
            isMarkdown: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "An error occurred",
            message: error.message
        });
    }
};

module.exports = { repoInfo };
