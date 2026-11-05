// Every editable text of the site lives here.
// Add a new entry and it automatically appears in the admin panel and in the database.

export type SettingField = {
  key: string;
  label: string;
  group: string;
  multiline?: boolean;
  def: string;
};

export const SETTING_FIELDS: SettingField[] = [
  // Site
  { key: "siteName", label: "Site name", group: "Site", def: "Your Name" },
  { key: "footerText", label: "Footer text", group: "Site", def: "Built with Next.js, Three.js and a lot of coffee" },

  // Navigation
  { key: "navAbout", label: "Menu: About", group: "Menu", def: "About" },
  { key: "navSkills", label: "Menu: Skills", group: "Menu", def: "Skills" },
  { key: "navProjects", label: "Menu: Projects", group: "Menu", def: "Projects" },
  { key: "navContact", label: "Menu: Contact", group: "Menu", def: "Contact" },

  // Hero
  { key: "heroTag", label: "Small tag above title", group: "Hero", def: "Available for freelance work" },
  { key: "heroTitle", label: "Hero title", group: "Hero", def: "I build beautiful things for the web" },
  { key: "heroSubtitle", label: "Hero subtitle", group: "Hero", multiline: true, def: "Developer & designer. Hire me for your next project." },
  { key: "ctaPrimary", label: "Button 1 text", group: "Hero", def: "See my work" },
  { key: "ctaSecondary", label: "Button 2 text", group: "Hero", def: "Hire me" },

  // About
  { key: "aboutTitle", label: "About title", group: "About", def: "About me" },
  { key: "aboutText", label: "About text", group: "About", multiline: true, def: "Write something about yourself here from the admin panel." },
  { key: "stat1Value", label: "Stat 1 value", group: "About", def: "50+" },
  { key: "stat1Label", label: "Stat 1 label", group: "About", def: "Projects done" },
  { key: "stat2Value", label: "Stat 2 value", group: "About", def: "5+" },
  { key: "stat2Label", label: "Stat 2 label", group: "About", def: "Years of experience" },
  { key: "stat3Value", label: "Stat 3 value", group: "About", def: "30+" },
  { key: "stat3Label", label: "Stat 3 label", group: "About", def: "Happy clients" },

  // Sections
  { key: "skillsTitle", label: "Skills title", group: "Sections", def: "My skills" },
  { key: "projectsTitle", label: "Projects title", group: "Sections", def: "Projects I built" },

  // Contact
  { key: "contactTitle", label: "Contact title", group: "Contact", def: "Let's work together" },
  { key: "contactText", label: "Contact text", group: "Contact", multiline: true, def: "Tell me about your project." },
  { key: "email", label: "Email", group: "Contact", def: "you@example.com" },
  { key: "github", label: "GitHub URL", group: "Contact", def: "https://github.com/yourname" },
];

export const DEFAULTS: Record<string, string> = Object.fromEntries(SETTING_FIELDS.map((f) => [f.key, f.def]));
