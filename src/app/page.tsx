import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { HeroArrival } from "@/components/hero-arrival";
import { CinematicExperience } from "@/components/cinematic/cinematic-experience";
import { NarrativeSignal } from "@/components/narrative-signal";
import { JourneySequence } from "@/components/journey-sequence";
import { CapabilityMap } from "@/components/capability-map";
import { ProjectLab } from "@/components/project-lab";
import { ContactActions } from "@/components/contact-actions";
import { portfolio } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Yashmit Singh - Explainable AI & Product Engineering",
};

function ExternalArrow() {
  return <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.8} />;
}

export default function Home() {
  const { profile } = portfolio;
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    description: profile.role,
    email: `mailto:${profile.email}`,
    homeLocation: { "@type": "Place", name: profile.location },
    url: process.env.NEXT_PUBLIC_SITE_URL || undefined,
    sameAs: [profile.github, profile.linkedin],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "University of Petroleum and Energy Studies",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <NarrativeSignal />
      <CinematicExperience />

      <header className="site-header">
        <a className="site-mark" href="#arrival" aria-label="Yashmit Singh, back to the beginning">
          <span>YS</span><strong>{profile.shortName}</strong>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#arrival">Home</a>
          <a href="#journey">About</a>
          <a href="#capabilities">Skills</a>
          <a href="#work">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="header-contact" href={profile.resume} target="_blank" rel="noreferrer">
          Résumé <ExternalArrow />
        </a>
        <details className="mobile-menu">
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Mobile navigation">
            <a href="#arrival">Home</a>
            <a href="#journey">About</a>
            <a href="#capabilities">Skills</a>
            <a href="#work">Projects</a>
            <a href="#experience">Experience</a>
            <a href="#contact">Contact</a>
            <a href={profile.resume} target="_blank" rel="noreferrer">Résumé</a>
          </nav>
        </details>
      </header>

      <main id="main-content">
        <section className="hero section-shell" id="arrival" aria-labelledby="arrival-title">
          <div className="hero-copy">
            <HeroArrival
              name={profile.name}
              role={profile.role}
              headline={profile.headline}
              introduction={profile.introduction}
              location={profile.location}
              availability={profile.availability}
              resume={profile.resume}
            />
          </div>
          <p className="scroll-cue"><span /> Follow the decision path</p>
        </section>

        <section className="journey section-shell" id="journey" aria-labelledby="journey-title">
          <div className="section-heading section-heading--split">
            <h2 id="journey-title">The work changed as the questions changed.</h2>
            <p>I started by asking whether a model could find the pattern. The work now asks two harder questions: can it explain the decision, and can the whole system be useful?</p>
          </div>
          <JourneySequence />
        </section>

        <section className="capabilities section-shell" id="capabilities" aria-labelledby="capabilities-title">
          <div className="section-heading">
            <h2 id="capabilities-title">Capabilities, connected to evidence.</h2>
            <p>Technologies are grouped by what they enable. “Current exploration” is intentionally separated from demonstrated project work.</p>
          </div>
          <CapabilityMap />
        </section>

        <section className="selected-work section-shell" id="work" aria-labelledby="work-title">
          <div className="section-heading section-heading--split">
            <h2 id="work-title">Three systems. Three different kinds of proof.</h2>
            <p>The first two are backed by the current résumé. LifeXP is labelled as an active build and keeps planned work visibly separate from completed work.</p>
          </div>
          <ProjectLab />
        </section>

        <section className="experience section-shell" id="experience" aria-labelledby="experience-title">
          <div className="section-heading section-heading--split">
            <h2 id="experience-title">Engineering in context.</h2>
            <p>The portfolio is the record of a student in motion: academic foundations, measurable technical work, and leadership outside a model pipeline.</p>
          </div>
          <div className="proof-layout">
            <div className="proof-column">
              <h3>Experience</h3>
              {portfolio.experience.map((item) => (
                <article key={item.role}><span>{item.period}</span><h4>{item.role}</h4><p className="proof-organisation">{item.organisation}</p><p>{item.detail}</p></article>
              ))}
            </div>
            <div className="proof-column">
              <h3>Education</h3>
              {portfolio.education.map((item) => (
                <article key={item.qualification}><span>{item.period}</span><h4>{item.qualification}</h4><p className="proof-organisation">{item.institution}</p><p>{item.detail}</p></article>
              ))}
            </div>
            <aside className="achievement-list" aria-labelledby="achievement-title">
              <h3 id="achievement-title">Recorded signals</h3>
              <ul>{portfolio.achievements.map((achievement) => <li key={achievement}>{achievement}</li>)}</ul>
              <p>No certifications were found in the repository, so none are displayed.</p>
            </aside>
          </div>
        </section>

        <section className="contact section-shell" id="contact" aria-labelledby="contact-title">
          <div className="contact-signal" aria-hidden="true"><span>Contact open</span><i /><i /></div>
          <div className="contact-copy">
            <h2 id="contact-title">Have a real problem worth thinking through?</h2>
            <p>I&apos;m interested in internships, early-career engineering roles, and collaborations around AI systems, product engineering, and applied machine learning.</p>
          </div>
          <ContactActions email={profile.email} github={profile.github} linkedin={profile.linkedin} resume={profile.resume} />
        </section>
      </main>

      <footer className="site-footer section-shell">
        <p>Designed and built around evidence from Yashmit&apos;s current portfolio and résumé.</p>
        <a href="#arrival">Return to the decision core ↑</a>
      </footer>
    </>
  );
}
