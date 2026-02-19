"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Project } from "./projectsData";

interface ProjectCardProps {
    project: Project;
    index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
    return (
        <div className="w-full h-full flex items-center justify-center bg-black">
            <div className="w-full max-w-7xl h-full flex flex-col lg:flex-row border-l border-white/10 overflow-hidden">
                {/* Left Column: Info */}
                <div className="flex-1 p-8 md:p-16 lg:p-24 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-4 mb-12">
                            <span className="text-6xl font-black text-white/5 font-sans leading-none">
                                0{index}
                            </span>
                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter leading-[0.9]">
                            {project.title}
                        </h2>

                        <p className="text-zinc-400 text-lg md:text-xl font-light leading-relaxed max-w-lg mb-12">
                            {project.description}
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {project.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-widest text-zinc-300 font-mono">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <button className="group flex items-center gap-4 text-white font-bold uppercase tracking-widest text-xs mt-12 hover:gap-6 transition-all duration-300">
                        View Case Study
                        <ArrowRight size={18} className="text-white group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Right Column: Visual */}
                <div className="flex-1 bg-neutral-900 overflow-hidden relative project-image-container">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
