import type { Link } from "../sections";
import { withoutDrafts } from "../../utils/drafts";

import dekaMd from "./deka/Deka.md?raw";
import nasaMd from "./nasa-jsc/NasaJsc.md?raw";
import stackUpMd from "./stack-up-redundancy/StackUpRedundancy.md?raw";
import funkyMd from "./funky/Funky.md?raw";
import snapbackMd from "./snapback/Snapback.md?raw";
import emberMd from "./ember/Ember.md?raw";
import iqpMd from "./iqp/IQP.md?raw";
import frc118Md from "./frc-118/FRC118.md?raw";
import rhoBetaEpsilonMd from "./rho-beta-epsilon/RhoBetaEpsilon.md?raw";
import rbe3002Md from "./rbe3002/RBE3002.md?raw";
import rbe3001Md from "./rbe3001/RBE3001.md?raw";
import rbe2002Md from "./rbe2002/RBE2002.md?raw";
import rbe1001Md from "./rbe1001/RBE1001.md?raw";
import me3310Md from "./me3310/ME3310.md?raw";

export interface Project {
    /** URL slug, e.g. #/wpi/rbe3002 */
    id: string;
    /** Which sidebar section it lives under (see sections.ts) */
    section: string;
    title: string;
    summary: string;
    date?: string;
    /** Your role on the project */
    role?: string;
    technologies: string[];
    /** Markdown body shown on the project's detail page */
    content: string;
    links?: Link[];
    /** Card image, a path under public/ */
    image?: string;
    /** Sub-heading within the section (see `groups` in sections.ts) */
    group?: string;
    /** "YYYY-MM" when it finished; the home page features the 3 most recent */
    sortDate?: string;
    /** No write-up yet: shown locally as a reminder, hidden on the live site, never featured */
    draft?: boolean;
}

const COMING_SOON = "*Write-up coming soon.*";

/** A titled entry with no write-up yet */
function placeholder(fields: Pick<Project, "id" | "section" | "title"> & Partial<Project>): Project {
    return { summary: "Write-up coming soon.", technologies: [], content: COMING_SOON, draft: true, ...fields };
}

// Within a section (and group), dated projects are shown newest first; undated
// ones follow in the order listed here.
export const allProjects: Project[] = [
    // ---- Work ----
    {
        id: "deka",
        sortDate: "2026-08",
        section: "work",
        title: "Controls Engineering Intern: DEKA Research & Development",
        summary: "Closed-loop stepper motor control, frequency-response characterization, and sensor filtering for prototype testing.",
        date: "Summer 2026",
        role: "Controls Engineering Intern · Manchester, NH",
        technologies: ["Arduino", "Python", "Kalman Filtering", "Controls"],
        content: dekaMd,
        image: "assets/projects/deka/deka-card.jpg",
    },
    {
        id: "nasa-jsc",
        sortDate: "2025-08",
        section: "work",
        title: "Robotics Academy / University Intern: NASA Johnson Space Center",
        summary: "Lunar rover mock-up construction, Space Exploration Vehicle maintenance, and mechanism design across three summers.",
        date: "Summers 2023–2025",
        role: "Robotics Academy Intern / University Intern · Houston, TX",
        technologies: ["Mechanical Design", "Fabrication", "Swerve Drive", "Sheet Metal", "3D Printing"],
        content: nasaMd,
        image: "assets/projects/nasa-jsc/sev-door-handle.jpg",
    },

    // ---- Competitive Robotics (FRC 190, then high school and earlier) ----
    placeholder({ id: "doom-spiral-turnover", section: "robotics", group: "season", title: "Doom Spiral / Turnover", date: "2026 Season", sortDate: "2026-04" }),
    {
        id: "stack-up-redundancy",
        group: "season",
        sortDate: "2025-04",
        section: "robotics",
        title: "Stack Up / Redundancy",
        summary: "2025 in-season robots. Led the Funnel and Stick subsystems; 3x district event winner and ranked 1st in New England.",
        date: "2025 Season",
        role: "Funnel & Stick subsystem lead · Drive Coach",
        technologies: ["CAD", "Mechanism Design", "Strategy"],
        content: stackUpMd,
        image: "assets/projects/stack-up-redundancy/robot.jpg",
        links: [
            { label: "The Blue Alliance", url: "https://www.thebluealliance.com/team/190/2025" },
            { label: "Development Video", url: "https://youtu.be/072Up5i1lFc" },
            { label: "Worlds Match Q106", url: "https://www.youtube.com/watch?v=1SiRO1gNYcQ" },
        ],
    },
    placeholder({ id: "v3", section: "robotics", group: "offseason", title: "V3", date: "2025 Off-Season", sortDate: "2025-10" }),
    placeholder({ id: "whiplash", section: "robotics", group: "offseason", title: "Whiplash", date: "2024 Off-Season", sortDate: "2024-11" }),
    {
        id: "funky",
        group: "offseason",
        sortDate: "2024-12",
        section: "robotics",
        title: "Funky",
        summary: "A modular test-platform robot for prototyping software and mechanisms ahead of the 2025 season.",
        date: "2024 Off-Season",
        role: "Designer & builder, alongside students",
        technologies: ["CAD", "Fabrication", "Electrical Integration"],
        content: funkyMd,
        image: "assets/projects/funky/with-systems.jpg",
    },
    {
        id: "snapback",
        group: "season",
        sortDate: "2024-04",
        section: "robotics",
        title: "Snapback",
        summary: "2024 in-season robot. Led the Intake and Centralizer subsystems; World Championship Curie Division winner.",
        date: "2024 Season",
        role: "Intake & Centralizer lead · Strategy Lead",
        technologies: ["CAD", "Pneumatics", "Mechanism Design"],
        content: snapbackMd,
        image: "assets/projects/snapback/robot.jpg",
        links: [
            { label: "The Blue Alliance", url: "https://www.thebluealliance.com/team/190/2024" },
            { label: "Intake Development Video", url: "https://youtu.be/Epo1W_Z9uko" },
            { label: "BattleCry Match E23", url: "https://www.youtube.com/watch?v=xtTtTD0xTxE" },
        ],
    },
    {
        id: "ember",
        group: "offseason",
        sortDate: "2023-10",
        section: "robotics",
        title: "Ember",
        summary: "An experimental swerve-drive robot with a ground cube intake, taken from idea to competing in three weeks.",
        date: "2023 Off-Season",
        role: "Project lead",
        technologies: ["Swerve Drive", "CAD", "Rapid Prototyping"],
        content: emberMd,
        image: "assets/projects/ember/assembled.jpg",
        links: [
            { label: "Development Video", url: "https://youtu.be/5k3lEUqPrUw" },
            { label: "Elims Match 6", url: "https://www.youtube.com/watch?v=wghaiO8E1y4" },
        ],
    },

    placeholder({ id: "trophies", section: "robotics", group: "rrc", title: "Trophies" }),

    // Draft: photos are in, write-up pending. Hidden on the live site until draft is removed.
    placeholder({
        id: "frc-118",
        section: "robotics",
        group: "frc-118",
        title: "FRC Team 118 Robonauts",
        date: "2019–2023",
        role: "Captain",
        summary: "Four seasons of robots: Mobius, Marauder, Horizon, and Echo. Write-up coming soon.",
        content: frc118Md,
        image: "assets/projects/frc-118/2023-echo.jpg",
    }),
    placeholder({ id: "vex-2373m", section: "robotics", group: "vex-2373m", title: "VEX Team 2373M", date: "2019–2023", role: "Captain" }),
    placeholder({ id: "best-robotics", section: "robotics", group: "early", title: "BEST Robotics" }),

    // ---- WPI ----
    {
        id: "rho-beta-epsilon",
        section: "wpi",
        group: "honor-society",
        title: "Rho Beta Epsilon: New Member Officer",
        summary: "Elected New Member Officer of WPI's Robotics Engineering honor society: leading recruitment, interviews, and induction of new members.",
        date: "September 2025 – present",
        role: "Elected officer",
        technologies: ["Leadership", "Interviewing", "Recruitment"],
        content: rhoBetaEpsilonMd,
    },
    placeholder({ id: "mqp", section: "wpi", group: "current", title: "MQP – Major Qualifying Project – FloorJet, a Mobile Floor-Painting Robot" }),
    placeholder({ id: "rbe4540", section: "wpi", group: "current", title: "RBE4540 – Vision-Based Robotic Manipulation" }),
    placeholder({ id: "rbe4701", section: "wpi", group: "current", title: "RBE4701 – Artificial Intelligence for Robotics" }),
    {
        id: "iqp",
        section: "wpi",
        group: "completed",
        title: "IQP – Interactive Qualifying Project",
        summary: "The Buildings of Venice: Venice's first building-by-building estimate of residential, tourist, and vacant units and population, built from city data and fieldwork on site.",
        date: "B-Term 2025",
        role: "Team of 4 · Venice, Italy",
        technologies: ["ArcGIS Pro", "Survey123", "Python", "GIS", "Linear Regression", "Fieldwork"],
        content: iqpMd,
        image: "assets/projects/iqp/residential-use-3d.jpg",
        sortDate: "2025-12",
    },
    placeholder({ id: "me3902", section: "wpi", group: "completed", title: "ME3902 – Project-Based Engineering Experimentation" }),
    {
        id: "rbe3002",
        group: "completed",
        sortDate: "2025-05",
        section: "wpi",
        title: "RBE3002 – Unified Robotics IV: Navigation",
        summary: "Programmed a TurtleBot3 with ROS to explore, map, and localize in an unknown arena. Finished in 6 of 15 allotted minutes.",
        date: "D-Term 2025",
        role: "Team of 4",
        technologies: ["ROS", "Python", "Linux", "Git", "Path Planning"],
        content: rbe3002Md,
        image: "assets/projects/rbe3002/mapping.jpg",
        links: [
            { label: "Lab Report", url: "https://docs.google.com/document/d/1mDyvq1uskRRFaA24FyfPsW9sb2k_1Rg79t1RZo6ixO8/edit?usp=sharing" },
            { label: "Code Release", url: "https://github.com/RBE300X-Lab/RBE3002_D25_Team10/releases/tag/final-release" },
        ],
    },
    {
        id: "rbe3001",
        group: "completed",
        sortDate: "2025-03",
        section: "wpi",
        title: "RBE3001 – Unified Robotics III: Manipulation",
        summary: "Forward and inverse kinematics for a 4-DOF arm that uses a camera to find and sort balls by color.",
        date: "C-Term 2025",
        role: "Team of 4",
        technologies: ["MATLAB", "Kinematics", "Computer Vision"],
        content: rbe3001Md,
        image: "assets/projects/rbe3001/arm.jpg",
        links: [
            { label: "Project Video", url: "https://www.youtube.com/watch?v=MtlLjE3h1JU" },
            { label: "Lab Report", url: "https://drive.google.com/file/d/12YIPqFAKuRZzJrVkINYRu_9DARkdS0A1/view?usp=sharing" },
            { label: "Code Release", url: "https://github.com/RBE3001-C25/RBE3001_C25_Team_8/releases/tag/lab-5" },
            { label: "Desmos 3D Model", url: "https://www.desmos.com/3d/djowqpqfzz" },
        ],
    },
    {
        id: "rbe2002",
        group: "completed",
        section: "wpi",
        title: "RBE2002 – Unified Robotics II: Sensing and Perception in Robotics",
        summary: "PID control, line following, AprilTag tracking, and state machines on a Pololu Romi. Worked on the first attempt.",
        role: "Team of 3",
        technologies: ["C++", "PID Control", "OpenMV", "State Machines"],
        content: rbe2002Md,
        image: "assets/projects/rbe2002/final-robot.jpg",
        links: [
            { label: "Development Video", url: "https://youtu.be/CzaxPlEQpvg" },
            { label: "Code Release", url: "https://github.com/ElliotScher/WPI-RBE-2002/releases/tag/final-release" },
        ],
    },
    placeholder({ id: "rbe2001", section: "wpi", group: "completed", title: "RBE2001 – Unified Robotics I: Mechanical Applications in Robotics" }),
    {
        id: "rbe1001",
        group: "completed",
        section: "wpi",
        title: "RBE1001 – Introduction to Robotics",
        summary: "Designed, built, and programmed a VEX robot in Python that won the class-wide competition.",
        role: "Team of 3",
        technologies: ["Python", "VEX", "Sensors", "State Machines"],
        content: rbe1001Md,
        image: "assets/projects/rbe1001/robot.jpg",
        links: [
            { label: "Lab Report", url: "https://docs.google.com/document/d/1JklVD2fkmJC6xfyGw0SMFfYot5r_s3oUnLOFl3DXKe4/edit?usp=sharing" },
            { label: "Competition Footage", url: "https://youtu.be/GQ07S2Kp06A" },
        ],
    },
    {
        id: "me3310",
        group: "completed",
        section: "wpi",
        title: "ME3310 – Kinematics of Mechanisms",
        summary: "A foot-pedal-actuated six-bar linkage, prototyped at 1:3 scale for under $30 and pitched Shark Tank style.",
        role: "Team of 4",
        technologies: ["Linkage Synthesis", "CAD", "Laser Cutting", "3D Printing"],
        content: me3310Md,
        image: "assets/projects/me3310/prototype.jpg",
        links: [
            { label: "Final Report", url: "https://docs.google.com/document/d/1sKprMgE6_HIPDpT7_m2_Se-KNmE6mpFDl1LxfM_augk/edit?usp=sharing" },
        ],
    },
    placeholder({ id: "ar1100", section: "wpi", group: "completed", title: "AR1100 – Essentials of Art" }),
    placeholder({ id: "ar2750", section: "wpi", group: "completed", title: "AR2750 – Topics in Studio Art" }),

    // ---- Personal ----
    placeholder({ id: "portfolio-website", section: "personal", title: "Personal Portfolio Website" }),
    placeholder({ id: "whiteboard-art-robot", section: "personal", title: "Whiteboard Art Robot" }),
    placeholder({ id: "frc-motor-controller", section: "personal", title: "FRC Motor Controller" }),
];

/** What the site shows: everything locally, only finished projects on the live site */
export const projects: Project[] = withoutDrafts(allProjects, project => !!project.draft);

/** Newest first by sortDate; undated projects go last, in their listed order. */
export function sortNewestFirst(list: Project[]): Project[] {
    return [...list].sort((a, b) => {
        if (a.sortDate && b.sortDate) return b.sortDate.localeCompare(a.sortDate);
        if (a.sortDate) return -1;
        if (b.sortDate) return 1;
        return 0;
    });
}

/** Most recent dated projects with write-ups (Work excluded), newest first */
export function recentProjects(count: number): Project[] {
    return sortNewestFirst(projects.filter(project => project.section !== "work" && project.sortDate && !project.draft))
        .slice(0, count);
}

/** A section's projects, newest first */
export function projectsInSection(sectionId: string): Project[] {
    return sortNewestFirst(projects.filter(project => project.section === sectionId));
}

export function findProject(sectionId: string, id: string): Project | undefined {
    return projects.find(project => project.section === sectionId && project.id === id);
}
