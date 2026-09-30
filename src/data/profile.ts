// Everything personal about the site lives here. Empty links are hidden.

export interface HeroLink {
    text: string;
    section: string;
    /** Leading words (the dash bullet hangs off them); defaults to the first word */
    lead?: string;
    /** Words to bold and grow on hover, anywhere in the line; defaults to the lead */
    highlight?: string[];
}

export const profile = {
    name: "Marcus Gafka",
    /** Sidebar photo, a path under public/ */
    headshot: "assets/profile/headshot.jpg",
    /** Close crop of the face, used as the round avatar on phones */
    headshotSmall: "assets/profile/headshot-face.jpg",
    /** Home page hero: "Hi! I'm <name>, a:" followed by these lines */
    heroIntro: "Passionate engineer, designer, roboticist, and hobbyist",
    /**
     * Each line links to a sidebar section (id from sections.ts). On hover its
     * highlighted words (`highlight`, else the lead: the first word or `lead`)
     * grow, bold, and turn the accent color.
     */
    heroLinks: [
        { text: "DEKA Research and NASA JSC Intern", highlight: ["DEKA", "NASA"], section: "work" },
        {
            text: "Worcester Polytechnic Institute Robotics and Mechanical Engineering student",
            lead: "Worcester Polytechnic Institute",
            section: "wpi",
        },
        {
            text: "First Robotics Competition Team 190 Mentor and Drive Coach",
            lead: "First Robotics Competition",
            section: "robotics",
        },
        { text: "Tinkerer, maker, and curious problem solver", section: "personal" },
    ] as HeroLink[],
    /** Path under public/, e.g. "resume/Marcus_Gafka_Resume.pdf". Leave empty to hide. */
    resumePdf: "resume/Marcus_Gafka_Resume.pdf",
    links: {
        github: "",
        linkedin: "https://www.linkedin.com/in/marcus-gafka/",
        youtube: "https://www.youtube.com/@marcusgafka",
        email: "msgafka@gmail.com",
    },
    /** GoatCounter site code (the "xyz" in xyz.goatcounter.com). Empty disables analytics. */
    goatcounterCode: "marcusgafka",
};
