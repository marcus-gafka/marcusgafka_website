export interface Link {
    label: string;
    url: string;
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
