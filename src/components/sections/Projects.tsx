import React from "react";
import TextPressure from "../blocks/TextAnimations/TextPressure/TextPressure";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { BsBoxArrowUpRight } from "react-icons/bs";

const projectList = [
    {
        name: "Grapphine Farm Management System ",
        description: "",
        github_url: "https://github.com/AFIF-ZILANI/fms-frontend",
        image: "/dashboard.png",
        live_url: "https://grapphine.vercel.app",
    },
    {
        name: "Grapphine Farm Management System Backend",
        description: "",
        github_url: "https://github.com/AFIF-ZILANI/fms-backend",
        image: "/coding.jpg",
        live_url: "",
    },
];

export default function Projects() {
    return (
        <section id="projects" className="min-h-screen mb-12">
            <div className="relative w-[90vw] mx-auto mb-4">
                <TextPressure
                    text="Projects"
                    flex={true}
                    alpha={false}
                    stroke={false}
                    width={true}
                    weight={true}
                    italic={true}
                    textColor="#A48FFF"
                    strokeColor="#ff0000"
                    minFontSize={36}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 md:px-12 ">
                {projectList.map(({ name, description, github_url, image, live_url }) => (
                    <div key={name} className="rounded-2xl shadow p-6 bg-card">
                        <div className="relative  w-full h-40 mb-4 rounded-lg">
                            <Image
                                src={image}
                                alt={`${name} screenshot`}
                                loading="lazy"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <h3 className="text-xl font-semibold text-primary mb-2">{name}</h3>
                        <p className="text-gray-600 mb-4">{description}</p>
                        <div className="flex justify-end gap-4 text-primary items-center">
                            <a href={github_url} target="_blank" rel="noreferrer">
                                <FaGithub />
                            </a>
                            {live_url && (
                                <a href={live_url} target="_blank" rel="noreferrer">
                                    <BsBoxArrowUpRight />
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
