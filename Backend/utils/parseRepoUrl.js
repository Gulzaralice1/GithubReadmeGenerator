// utils/parseRepoUrl.js
export function parseRepoUrl(repoUrl) {
    // Remove any trailing ".git"
    const cleanUrl = repoUrl.replace(/\.git$/, "");
    
    // Split by "/"
    const parts = cleanUrl.split("/");
    
    // Get owner and repo
    const owner = parts[parts.length - 2];
    const repo = parts[parts.length - 1];
    
    // Return as an object
    return { owner, repo };
}
