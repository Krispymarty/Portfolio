import { getGithubUser, getGithubRepos } from "@/lib/github";
import featuredProjectsData from "@/data/featuredProjects.json";
import buildStatusData from "@/data/buildStatus.json";
import buildLogData from "@/data/buildLog.json";
import currentLearningData from "@/data/currentLearning.json";

import { LandingSection } from "@/components/sections/landing-section";
import { AboutSection } from "@/components/sections/about-section";
import { LifeXPSection } from "@/components/sections/lifexp-section";
import { BuildLogSection } from "@/components/sections/build-log-section";
import { FeaturedProjectsSection } from "@/components/sections/featured-projects-section";
import { CurrentLearningSection } from "@/components/sections/current-learning-section";
import { GitHubIntegrationSection } from "@/components/sections/github-integration-section";
import { AIAssistantSection } from "@/components/sections/ai-assistant-section";
import { ContactSection } from "@/components/sections/contact-section";

export default async function Home() {
  const user = await getGithubUser("Krispymarty");
  const repos = await getGithubRepos("Krispymarty");

  return (
    <div className="flex flex-col">
      <LandingSection />
      <LifeXPSection />
      <AboutSection />
      <FeaturedProjectsSection featuredData={featuredProjectsData} />
      <BuildLogSection buildLogs={buildLogData} />
      <CurrentLearningSection learningItems={currentLearningData} />
      <GitHubIntegrationSection user={user} repos={repos} />
      <AIAssistantSection />
      <ContactSection />
    </div>
  );
}
