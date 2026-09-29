export interface Link {
    label: string;
    url: string;
}

export interface Group {
    id: string;
    title: string;
}

/** A paragraph-only post shown in a section's feed but not in the right panel */
export interface TextPost {
    id: string;
    title: string;
    /** Markdown; empty shows "Coming soon." */
    body: string;
    /** Group it opens (see `groups`); omit to show it at the top of the feed */
    group?: string;
    /** Place it directly before this project's post instead of at the start of the group */
    before?: string;
}

export interface Section {
    /** URL slug, e.g. #/wpi */
    id: string;
    /** Sidebar label */
    label: string;
    title: string;
    /** Shown at the top of the section page */
    intro: string;
    links?: Link[];
    /** Optional sub-headings on the section page; projects pick one with `group` */
    groups?: Group[];
    textPosts?: TextPost[];
}

// Sidebar order. Home and About are added around these by the sidebar.
export const sections: Section[] = [
    {
        id: "work",
        label: "Work",
        title: "Work Experience",
        intro: "Robotics and controls internships in industry and at NASA.",
    },
    {
        id: "wpi",
        label: "WPI",
        title: "WPI Coursework",
        intro: "Team projects from the Robotics and Mechanical Engineering programs at Worcester Polytechnic Institute.",
        groups: [
            { id: "current", title: "Current" },
            { id: "completed", title: "Completed" },
        ],
        textPosts: [
            { id: "art-in-engineering", title: "Art in Engineering", body: "", group: "completed", before: "ar1100" },
        ],
    },
    {
        id: "190",
        label: "190",
        title: "FRC Team 190",
        intro: "Since 2023 I've been a college mentor for FIRST Robotics Competition Team 190 at WPI, putting in about 400 hours a year plus travel to competitions. I design and build mechanisms side by side with high school students, and I'm currently the team's drive coach, responsible for match strategy, coordinating with alliance partners, and running the team on the field.",
        links: [
            { label: "The Blue Alliance", url: "https://www.thebluealliance.com/team/190" },
            { label: "YouTube", url: "https://www.youtube.com/@FRC190/videos" },
        ],
        groups: [
            { id: "season", title: "Season Robots" },
            { id: "offseason", title: "Off-Season Contributions" },
            { id: "rrc", title: "WPI RRC" },
        ],
        textPosts: [
            { id: "why-frc", title: "Why I Love FRC", body: "" },
            { id: "what-is-rrc", title: "What Is the WPI RRC?", body: "", group: "rrc" },
        ],
    },
    {
        id: "personal",
        label: "Personal",
        title: "Personal Projects",
        intro: "Things I build on my own time.",
    },
];

export function findSection(id: string): Section | undefined {
    return sections.find(section => section.id === id);
}
