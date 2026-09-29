import type { Link } from "../sections";

import dekaMd from "./deka/Deka.md?raw";
import nasaMd from "./nasa-jsc/NasaJsc.md?raw";
import stackUpMd from "./stack-up-redundancy/StackUpRedundancy.md?raw";
import funkyMd from "./funky/Funky.md?raw";
import snapbackMd from "./snapback/Snapback.md?raw";
import emberMd from "./ember/Ember.md?raw";
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
    /** Shown on the home page */
    featured?: boolean;
}

// Projects appear in this order within each section.
export const projects: Project[] = [
    // ---- Work ----
    {
        id: "deka",
        section: "work",
        title: "Controls Engineering Intern: DEKA Research & Development",
        summary: "Closed-loop stepper motor control, frequency-response characterization, and sensor filtering for prototype testing.",
        date: "Summer 2026",
        role: "Controls Engineering Intern · Manchester, NH",
        technologies: ["Arduino", "Python", "Kalman Filtering", "Controls"],
        content: dekaMd,
    },
    {
        id: "nasa-jsc",
        section: "work",
        title: "Robotics Academy / University Intern: NASA Johnson Space Center",
        summary: "Lunar rover mock-up construction, Space Exploration Vehicle maintenance, and mechanism design across three summers.",
        date: "Summers 2023–2025",
        role: "Robotics Academy Intern / University Intern · Houston, TX",
        technologies: ["Mechanical Design", "Fabrication", "Swerve Drive"],
        content: nasaMd,
    },

    // ---- FRC 190 ----
    {
        id: "stack-up-redundancy",
        section: "190",
        title: "Stack Up / Redundancy",
        summary: "2025 in-season robots. Led the Funnel and Stick subsystems; 3x district event winner and ranked 1st in New England.",
        date: "2025 Season",
        role: "Funnel & Stick subsystem lead · Drive Coach",
        technologies: ["CAD", "Mechanism Design", "Strategy"],
        content: stackUpMd,
        image: "assets/projects/stack-up-redundancy/robot.jpg",
        featured: true,
        links: [
            { label: "The Blue Alliance", url: "https://www.thebluealliance.com/team/190/2025" },
            { label: "Development Video", url: "https://youtu.be/072Up5i1lFc" },
            { label: "Worlds Match Q106", url: "https://www.youtube.com/watch?v=1SiRO1gNYcQ" },
        ],
    },
    {
        id: "funky",
        section: "190",
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
        section: "190",
        title: "Snapback",
        summary: "2024 in-season robot. Led the Intake and Centralizer subsystems; World Championship Curie Division winner.",
        date: "2024 Season",
        role: "Intake & Centralizer lead · Strategy Lead",
        technologies: ["CAD", "Pneumatics", "Mechanism Design"],
        content: snapbackMd,
        image: "assets/projects/snapback/robot.jpg",
        featured: true,
        links: [
            { label: "The Blue Alliance", url: "https://www.thebluealliance.com/team/190/2024" },
            { label: "Intake Development Video", url: "https://youtu.be/Epo1W_Z9uko" },
            { label: "BattleCry Match E23", url: "https://www.youtube.com/watch?v=xtTtTD0xTxE" },
        ],
    },
    {
        id: "ember",
        section: "190",
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

    // ---- WPI ----
    {
        id: "rbe3002",
        section: "wpi",
        title: "RBE3002: Autonomous Mapping & Navigation",
        summary: "Programmed a TurtleBot3 with ROS to explore, map, and localize in an unknown arena. Finished in 6 of 15 allotted minutes.",
        date: "D-Term 2025",
        role: "Team of 4",
        technologies: ["ROS", "Python", "Linux", "Git", "Path Planning"],
        content: rbe3002Md,
        image: "assets/projects/rbe3002/mapping.jpg",
        featured: true,
        links: [
            { label: "Lab Report", url: "https://docs.google.com/document/d/1mDyvq1uskRRFaA24FyfPsW9sb2k_1Rg79t1RZo6ixO8/edit?usp=sharing" },
            { label: "Code Release", url: "https://github.com/RBE300X-Lab/RBE3002_D25_Team10/releases/tag/final-release" },
        ],
    },
    {
        id: "rbe3001",
        section: "wpi",
        title: "RBE3001: Vision-Guided Robot Arm",
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
        section: "wpi",
        title: "RBE2002: Autonomous Trash Collection Robot",
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
    {
        id: "rbe1001",
        section: "wpi",
        title: "RBE1001: Competition Robot",
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
        section: "wpi",
        title: "ME3310: Oven Door Opener Mechanism",
        summary: "A foot-pedal-actuated six-bar linkage, prototyped at 1:3 scale for under $30 and pitched Shark Tank style.",
        role: "Team of 4",
        technologies: ["Linkage Synthesis", "CAD", "Laser Cutting", "3D Printing"],
        content: me3310Md,
        image: "assets/projects/me3310/prototype.jpg",
        links: [
            { label: "Final Report", url: "https://docs.google.com/document/d/1sKprMgE6_HIPDpT7_m2_Se-KNmE6mpFDl1LxfM_augk/edit?usp=sharing" },
        ],
    },
];

export function projectsInSection(sectionId: string): Project[] {
    return projects.filter(project => project.section === sectionId);
}

export function findProject(sectionId: string, id: string): Project | undefined {
    return projects.find(project => project.section === sectionId && project.id === id);
}
