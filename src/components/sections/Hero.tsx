"use client";

import React, { useRef } from "react";
import Orb from "../blocks/Backgrounds/Orb/Orb";
import Image from "next/image";
import HeroImage from "@/assets/images/prfile.png";
import { FaXTwitter, FaInstagram, FaLinkedin } from "react-icons/fa6";
import { FaGithub, FaFacebook } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import TrueFocus from "../blocks/TextAnimations/TrueFocus/TrueFocus";
import { useGSAP } from "@gsap/react";
import { Button } from "../ui/button";
import gsap from "gsap";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ContactForm from "./ContactMe";

export default function Hero() {
    useGSAP(() => {
        gsap.to("#fromDown", {
            opacity: 1,
            y: -200,
            delay: 2,
            ease: "expo.out",
        });

        gsap.to("#heroImg", { opacity: 1, delay: 1 });
    });
    return (
        <div className="md:grid md:grid-cols-2 md:pt-8 h-screen">
            <div className="flex items-center justify-center">
                <div className="w-full h-[30rem] relative">
                    <Orb
                        hoverIntensity={0.5}
                        rotateOnHover={true}
                        hue={0}
                        forceHoverState={false}
                    />
                </div>
                <div
                    id="heroImg"
                    className="md:w-[20rem] w-[15rem] md:h-[20rem] h-[15rem] absolute rounded-full opacity-0"
                >
                    <Image className="rounded-full" src={HeroImage} alt="Hero Image" fill />
                </div>
            </div>
            <div className="flex items-center relative bottom-16 md:bottom-0">
                <div className="flex flex-col items-center gap-5">
                    <TrueFocus
                        sentence="AFIF ZILANI"
                        manualMode={false}
                        blurAmount={5}
                        borderColor="blue"
                        animationDuration={2}
                        pauseBetweenAnimations={1}
                    />
                    <div className="flex flex-col items-center gap-2">
                        <span className="font-semibold md:text-xl text-center text-muted-foreground sm:tracking-[0.55em] tracking-[0.7em]">
                            FULL STACK WEB DEVELOPER
                        </span>
                        <span className="tracking-widest text-muted-foreground sm:text-sm text-xs">
                            📍 Naogaon, Dhaka, Bangladesh
                        </span>
                        <div className="flex gap-4 mt-1">
                            <a
                                href="https://github.com/AFIF-ZILANI"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaGithub />
                            </a>
                            <a
                                href="https://linkedin.com/in/afifzilani/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaLinkedin />
                            </a>
                            <a
                                href="https://x.com/afif_zilani/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaXTwitter />
                            </a>
                            <a
                                href="mailto:afifzilani4566@gmail.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <IoIosMail />
                            </a>
                            <a
                                href="https://instagram.com/afif.zilani/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaInstagram />
                            </a>
                            <a
                                href="https://www.facebook.com/AFIF.ZILANI00/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaFacebook />
                            </a>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    id="fromDown"
                                    className="mt-8 hover:text-white duration-300 cursor-pointer opacity-0 relative top-[200px]"
                                >
                                    Get in Touch
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Contact With Me</AlertDialogTitle>
                                </AlertDialogHeader>
                                <ContactForm />
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </div>
        </div>
    );
}
