import React from "react";
import TextPressure from "../blocks/TextAnimations/TextPressure/TextPressure";
import Image from "next/image";
import Project1 from "@/assets/images/project1.jpg";
import Project2 from "@/assets/images/project2.jpg";
import Project3 from "@/assets/images/project3.jpg";
import { FaGithub } from "react-icons/fa";
import { BsBoxArrowUpRight } from "react-icons/bs";

const projectList = [
    {
        name: "TaskMaster Pro",
        description:
            "A productivity app to organize, prioritize, and track your daily tasks with deadlines and reminders.",
        github_url: "https://github.com/yourusername/taskmaster-pro",
        image: Project1,
        live_url: "https://taskmaster.example.com",
    },
    {
        name: "ShopEase",
        description:
            "A full-featured e-commerce platform with shopping cart, payment integration, and order management.",
        github_url: "https://github.com/yourusername/shopease",
        image: Project2,
        live_url: "https://shopease.example.com",
    },
    {
        name: "FitTrack",
        description:
            "A health & fitness tracker that logs workouts, nutrition, and progress charts to help you meet your goals.",
        github_url: "https://github.com/yourusername/fittrack",
        image: Project3,
        live_url: "https://fittrack.example.com",
    },
    {
        name: "Travelogue",
        description:
            "A social travel diary app where users can post photos, map routes, and share travel stories.",
        github_url: "https://github.com/yourusername/travelogue",
        image: Project1,
        live_url: "https://travelogue.example.com",
    },
    {
        name: "BudgetBuddy",
        description:
            "A personal finance dashboard that categorizes spending, sets budgets, and forecasts monthly expenses.",
        github_url: "https://github.com/yourusername/budgetbuddy",
        image: Project2,
        live_url: "https://budgetbuddy.example.com",
    },
    {
        name: "ChatConnect",
        description:
            "A real-time chat application with rooms, direct messaging, and emoji reactions powered by WebSockets.",
        github_url: "https://github.com/yourusername/chatconnect",
        image: Project3,
        live_url: "https://chatconnect.example.com",
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
                        <Image
                            src={image}
                            alt={`${name} screenshot`}
                            loading="lazy"
                            className="mb-4 w-full h-40 object-cover rounded-lg"
                        />
                        <h3 className="text-xl font-semibold text-primary mb-2">{name}</h3>
                        <p className="text-gray-600 mb-4">{description}</p>
                        <div className="flex justify-end gap-4 text-primary items-center">
                            <a href={github_url} target="_blank" rel="noreferrer">
                                <FaGithub />
                            </a>
                            <a href={live_url} target="_blank" rel="noreferrer">
                                <BsBoxArrowUpRight />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
