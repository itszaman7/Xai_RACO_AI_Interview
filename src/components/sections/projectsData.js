export interface Project {
    id: string;
    title: string;
    description: string;
    image: string;
    color: string;
    tags: string[];
}

export const getProjects = async (): Promise<Project[]> => {
    // Simulating a database fetch
    return [
        {
            id: "1",
            title: "Xai Ecosystem",
            description: "A comprehensive platform for training and deploying agentic AI systems at scale.",
            image: "https://images.unsplash.com/photo-1620712943543-bcc4628c71d0?auto=format&fit=crop&q=80&w=1200",
            color: "#fbbf24",
            tags: ["AI", "Infrastructure", "Next.js"]
        },
        {
            id: "2",
            title: "Neural Interface",
            description: "Direct brain-to-text processing using low-latency tensor streams.",
            image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200",
            color: "#22d3ee",
            tags: ["Hardware", "Neural", "Python"]
        },
        {
            id: "3",
            title: "Temporal Analysis",
            description: "Predictive modeling for global data trends across multi-verse timelines.",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
            color: "#d946ef",
            tags: ["Big Data", "Visual", "React"]
        }
    ];
};
