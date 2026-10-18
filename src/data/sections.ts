import { withoutDrafts } from "../utils/drafts";
import type { Link } from "./types";
import scholarshipMd from "./wpi/scholarship.md?raw";
import frc190Md from "./robotics/frc-190.md?raw";

export interface Group {
    id: string;
    title: string;
}

/** A paragraph-only post shown in a section's feed but not in the right panel */
export interface TextPost {
    id: string;
    title: string;
    /** Markdown; while empty it's a draft: "Coming soon." locally, hidden on the live site */
    body: string;
    /** Group it opens (see `groups`); omit to show it at the top of the feed */
    group?: string;
    /** Place it directly before this project's post instead of at the start of the group */
    before?: string;
    /** Skip the post's own title when its group heading already says it */
    hideTitle?: boolean;
    /** Shown under the post as buttons */
    links?: Link[];
}

/** A headline fact in a section's hero, e.g. { value: "3.94", label: "GPA" } */
export interface Highlight {
    value: string;
    label: string;
}

/** A logo shown beside a section's title */
export interface Logo {
    src: string;
    alt: string;
}

export interface Section {
    /** URL slug, e.g. #/wpi */
    id: string;
    /** Sidebar label */
    label: string;
    title: string;
    /** Shown at the top of the section page; leave empty for none */
    intro: string;
    /** Optional hero facts shown as cards under the intro */
    highlights?: Highlight[];
    /** Optional logos beside the title, paths under public/ */
    logos?: Logo[];
    links?: Link[];
    /** Optional sub-headings on the section page; projects pick one with `group` */
    groups?: Group[];
    textPosts?: TextPost[];
    /** Shown locally but hidden on the live site (sidebar, page, and home hero line) */
    draft?: boolean;
}

// Sidebar order. Home and About Me are added around these by the sidebar.
const allSections: Section[] = [
    {
        id: "work",
        label: "Work",
        title: "Work Experience",
        intro: "Robotics and controls internships in industry and at NASA.",
    },
    {
        id: "wpi",
        label: "WPI",
        title: "Worcester Polytechnic Institute",
        intro: "",
        logos: [
            { src: "assets/wpi/wpi-wordmark.svg", alt: "WPI" },
        ],
        highlights: [
            { value: "Full tuition", label: "Sole recipient of WPI's merit-based FRC scholarship" },
            { value: "Double major", label: "B.S. Robotics Engineering & B.S. Mechanical Engineering" },
            { value: "3.94 GPA", label: "Graduating May 2027" },
            { value: "Venice, Italy", label: "Study abroad: Buildings of Venice IQP" },
            { value: "New Member Officer", label: "Rho Beta Epsilon Robotics Honor Society" },
        ],
        groups: [
            { id: "scholarship", title: "Scholarship" },
            { id: "honor-society", title: "Robotics Honor Society (Rho Beta Epsilon)" },
            { id: "current", title: "Coursework · Current" },
            { id: "completed", title: "Coursework · Completed" },
            { id: "art", title: "Art" },
        ],
        textPosts: [
            { id: "scholarship", title: "WPI FRC Scholarship", body: scholarshipMd, group: "scholarship" },
            { id: "art-in-engineering", title: "Art in Engineering", body: "", group: "art" },
        ],
    },
    {
        id: "robotics",
        label: "Competitive Robotics",
        title: "Competitive Robotics",
        intro: "The competition robots I've designed, built, driven, and mentored, newest first: from mentoring FIRST Robotics Competition Team 190 at WPI back to captaining FRC Team 118 in high school.",
        groups: [
            { id: "frc-190", title: "FRC Team 190 · Mentor and Drive Coach" },
            { id: "season", title: "FRC Team 190 · Season Robots" },
            { id: "offseason", title: "FRC Team 190 · Off-Season" },
            { id: "rrc", title: "WPI Robotics Resource Center" },
            { id: "frc-118", title: "High School · FRC Team 118 Robonauts" },
            { id: "vex-2373m", title: "High School · VEX Team 2373M" },
            { id: "early", title: "Where It Started" },
        ],
        textPosts: [
            {
                id: "frc-190",
                title: "FRC Team 190: Mentor & Drive Coach (2023–present)",
                hideTitle: true,
                group: "frc-190",
                body: frc190Md,
                links: [
                    { label: "The Blue Alliance", url: "https://www.thebluealliance.com/team/190" },
                    { label: "YouTube", url: "https://www.youtube.com/@FRC190/videos" },
                ],
            },
            { id: "why-frc", title: "Why I Love FRC", body: "", group: "season" },
            { id: "what-is-rrc", title: "What Is the WPI RRC?", body: "", group: "rrc" },
            { id: "early-interest", title: "Early Robotics Interest", body: "", group: "early" },
        ],
    },
    {
        id: "personal",
        label: "Personal",
        title: "Personal Projects",
        intro: "Things I build on my own time.",
        draft: true,
    },
];

/** Sections on the site, without draft sections on the live site */
export const sections: Section[] = withoutDrafts(allSections, section => !!section.draft);

/** A section's paragraph posts, without empty drafts on the live site */
export function visibleTextPosts(section: Section): TextPost[] {
    return withoutDrafts(section.textPosts ?? [], post => !post.body.trim());
}

/** Old section URLs that still work (e.g. #/190/snapback → #/robotics/snapback) */
export const sectionAliases: Record<string, string> = { "190": "robotics" };

export function findSection(id: string): Section | undefined {
    return sections.find(section => section.id === id);
}
