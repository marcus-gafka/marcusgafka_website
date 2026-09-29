// Everything personal about the site lives here. Empty links are hidden.
export const profile = {
    name: "Marcus Gafka",
    /** Home page hero: "Hi, I'm <name>, a:" followed by these lines */
    heroIntro: "Passionate engineer, roboticist, and designer",
    /** Each line links to a sidebar section (id from sections.ts); its first word is highlighted on hover */
    heroLinks: [
        { text: "Former employee @ DEKA Research and NASA", section: "work" },
        { text: "WPI Robotics and Mechanical Engineering student", section: "wpi" },
        { text: "FRC Team 190 Mentor and Drive Coach", section: "190" },
        { text: "Tinkerer and forever student of life", section: "personal" },
    ],
    /** Path under public/, e.g. "resume/Marcus_Gafka_Resume.pdf". Leave empty to hide. */
    resumePdf: "",
    heroImage: "assets/home/hero.jpg",
    links: {
        github: "https://github.com/marcus-gafka",
        linkedin: "",
        email: "",
    },
};
