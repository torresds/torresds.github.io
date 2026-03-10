export interface GithubUser {
    login: string;
    avatar_url: string;
    html_url: string;
    name: string;
    bio: string;
    public_repos: number;
    followers: number;
}

export interface GithubRepo {
    id: number;
    name: string;
    html_url: string;
    description: string;
    stargazers_count: number;
    language: string;
    fork: boolean;
    updated_at: string;
}

export interface GithubStats {
    topLanguage: string;
    languageCount: Record<string, number>;
    totalStars: number;
}

export const useGithubAPI = () => {
    const fetchUser = async (username: string): Promise<GithubUser> => {
        const res = await fetch(`https://api.github.com/users/${username}`);
        if (!res.ok) throw new Error('API Error');
        return res.json();
    };

    const fetchRepos = async (username: string): Promise<{ repos: GithubRepo[], stats: GithubStats }> => {
        const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        if (!res.ok) throw new Error('API Error');
        const allRepos: GithubRepo[] = await res.json();

        const validRepos = allRepos.filter(r => !r.fork);

        const languageCount: Record<string, number> = {};
        let totalStars = 0;

        validRepos.forEach(repo => {
            totalStars += repo.stargazers_count;
            if (repo.language) {
                languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
            }
        });

        const topLanguage = Object.keys(languageCount).length > 0
            ? Object.keys(languageCount).reduce((a, b) => (languageCount[a] || 0) > (languageCount[b] || 0) ? a : b)
            : 'Unknown';

        const rankedRepos = validRepos
            .sort((a, b) => b.stargazers_count - a.stargazers_count);

        return {
            repos: rankedRepos,
            stats: { topLanguage, languageCount, totalStars }
        };
    };

    return { fetchUser, fetchRepos };
};
