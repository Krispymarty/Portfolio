"use client";

import { useState } from "react";
import { Check, Clipboard, Download, Mail } from "lucide-react";
import { FaGithub as Github, FaLinkedin as Linkedin } from "react-icons/fa";

type ContactActionsProps = {
  email: string;
  github: string;
  linkedin: string;
  resume: string;
};

export function ContactActions({ email, github, linkedin, resume }: ContactActionsProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2200);
    } catch {
      setCopyState("error");
    }
  };

  return (
    <div className="contact-actions">
      <a className="contact-email" href={`mailto:${email}`}>
        <Mail aria-hidden="true" size={20} />
        {email}
      </a>
      <button type="button" className="copy-email" onClick={copyEmail}>
        {copyState === "copied" ? <Check aria-hidden="true" size={18} /> : <Clipboard aria-hidden="true" size={18} />}
        {copyState === "copied" ? "Email copied" : copyState === "error" ? "Copy unavailable" : "Copy email"}
      </button>
      <a href={linkedin} target="_blank" rel="noreferrer">
        <Linkedin aria-hidden="true" size={18} />LinkedIn <span aria-hidden="true">↗</span>
      </a>
      <a href={github} target="_blank" rel="noreferrer">
        <Github aria-hidden="true" size={18} />GitHub <span aria-hidden="true">↗</span>
      </a>
      <a href={resume} target="_blank" rel="noreferrer">
        <Download aria-hidden="true" size={18} />Résumé
      </a>
      <p className="copy-status" aria-live="polite">
        {copyState === "copied" ? "Email address copied to clipboard." : copyState === "error" ? "Copy failed. Use the email link instead." : ""}
      </p>
    </div>
  );
}