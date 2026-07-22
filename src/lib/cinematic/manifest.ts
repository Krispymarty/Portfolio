export type CinematicSequenceId = "initialize" | "transformation" | "details";
export type CinematicChapterId = "arrival" | "journey" | "capabilities" | "work" | "experience" | "contact";

export const cinematicAssetVersion = "2026-07-22-amber-light";

export type CinematicSequence = {
  id: CinematicSequenceId;
  frameCount: number;
  frameUrl: (frame: number) => string;
  poster: string;
  video: string;
};

export type CinematicChapter = {
  id: CinematicChapterId;
  sequence: CinematicSequenceId;
  direction: "forward" | "reverse" | "hold-start" | "hold-end";
};

const withVersion = (url: string) => `${url}?v=${cinematicAssetVersion}`;
const frameUrl = (sequence: CinematicSequenceId, frame: number) =>
  withVersion(`/cinematic/${sequence}/frame_${String(frame).padStart(4, "0")}.webp`);

export const cinematicSequences: Record<CinematicSequenceId, CinematicSequence> = {
  initialize: {
    id: "initialize",
    frameCount: 120,
    frameUrl: (frame) => frameUrl("initialize", frame),
    poster: withVersion("/cinematic/posters/initialize.webp"),
    video: withVersion("/cinematic/mobile/initialize.mp4"),
  },
  transformation: {
    id: "transformation",
    frameCount: 144,
    frameUrl: (frame) => frameUrl("transformation", frame),
    poster: withVersion("/cinematic/posters/transformation.webp"),
    video: withVersion("/cinematic/mobile/transformation.mp4"),
  },
  details: {
    id: "details",
    frameCount: 120,
    frameUrl: (frame) => frameUrl("details", frame),
    poster: withVersion("/cinematic/posters/details.webp"),
    video: withVersion("/cinematic/mobile/details.mp4"),
  },
};

export const cinematicChapters: CinematicChapter[] = [
  { id: "arrival", sequence: "initialize", direction: "forward" },
  { id: "journey", sequence: "initialize", direction: "hold-end" },
  { id: "capabilities", sequence: "transformation", direction: "forward" },
  { id: "work", sequence: "transformation", direction: "hold-end" },
  { id: "experience", sequence: "details", direction: "forward" },
  { id: "contact", sequence: "details", direction: "hold-end" },
];
