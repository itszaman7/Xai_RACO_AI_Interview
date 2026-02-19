"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "./ProjectCard";
import { getProjects, Project } from "./projectsData";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const ProjectGallery = () => {
    const containerRef = useRef<HTMLElement>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getProjects();
                setProjects(data);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    useGSAP(() => {
        if (isLoading || projects.length === 0) return;

        const container = containerRef.current;
        if (!container) return;

        // Small delay to ensure DOM is fully rendered
        const timer = setTimeout(() => {
            const cards = gsap.utils.toArray<HTMLElement>(".work-card", container);
            ScrollTrigger.refresh();

            cards.forEach((card, index) => {
                if (index === cards.length - 1) return; // Don't animate the last card

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: card,
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                        invalidateOnRefresh: true,
                    },
                });

                // Scale, border-radius, and rotation animation
                // Scaling down more (0.9 instead of 0.65) to keep it visible under the next card
                tl.to(card, {
                    scale: 0.9,
                    borderRadius: "40px",
                    filter: "brightness(0.5) blur(2px)", // Dimming instead of hiding
                    ease: "sine.inOut",
                })
                    .to(card, {
                        rotation: index % 2 === 0 ? 2 : -2,
                        ease: "sine.inOut",
                    }, 0);

                // Image Parallax
                const image = card.querySelector(".project-image-container img");
                if (image) {
                    tl.to(image, { scale: 1.2, ease: "none" }, 0);
                }
            });
        }, 100);

        return () => {
            clearTimeout(timer);
            ScrollTrigger.getAll().forEach((st) => st.kill());
        };
    }, { scope: containerRef, dependencies: [isLoading, projects.length] });

    if (isLoading) {
        return (
            <section className="w-full h-screen flex items-center justify-center bg-black">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Loading works...</p>
                </div>
            </section>
        );
    }

    return (
        <section ref={containerRef} className="w-full relative bg-black">
            {/* Header with high contrast */}
            <div className="px-6 md:px-12 lg:px-24 pt-32 pb-16 bg-black">
                <div className="inline-flex items-center gap-3 mb-6">
                    <div className="h-px w-8 bg-zinc-800" />
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">Our Portfolio</span>
                </div>
                <h2 className="text-white font-bold tracking-tighter text-[11.5vw] leading-[0.8] mb-8">
                    SELECTED WORK
                </h2>
                <p className="text-zinc-500 max-w-sm ml-1">
                    Exploring the boundaries of generative systems and agentic intelligence.
                </p>
            </div>

            <div className="relative">
                {projects.map((project, i) => (
                    <div
                        key={project.id}
                        className="work-card sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center"
                        style={{ zIndex: i + 1 }}
                    >
                        <ProjectCard project={project} index={i + 1} />
                    </div>
                ))}
            </div>

            {/* Spacer to allow the last card to scroll properly if needed */}
            <div className="h-32" />
        </section>
    );
};

export default ProjectGallery;
