/*
 * AWS Student Community Day — IGDTUW
 * Single source of truth for the site.
 *
 * Only values that exist in the project assets/copy are filled in.
 * Anything still to be confirmed is an empty string "" and renders as
 * "TBA / coming soon" in the UI, so organisers can update this file
 * without touching markup or styles.
 */

/* eslint-disable no-unused-vars */
var EVENT = {
  name: "AWS Student Community Day",
  org: "AWS Cloud Club, IGDTUW",
  tagline: "A free one-day student conference on cloud at IGDTUW.",

  dateLabel: "30 October 2026",
  startTime: "9:00 AM",
  endTime: "6:00 PM",

  venue: {
    name: "IGDTUW Auditorium",
    address: "Indira Gandhi Delhi Technical University for Women, Kashmere Gate, Delhi",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.8055370309853!2d77.22942760932312!3d28.665540782482477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd0682f8aa2b%3A0x84c5888a85caa2bd!2sIGDTUW%20Auditorium!5e0!3m2!1sen!2sin!4v1703256687127!5m2!1sen!2sin",
    venueUrl: "https://www.google.com/maps/search/?api=1&query=IGDTUW+Auditorium+Delhi",
  },

  // Registration is handled externally on Konfhub. We hand off to it and
  // set expectations; we never fake a confirmation on this site.
  konfhubUrl: "https://konfhub.com/awsstudentcommunityigdtuw",
  isFree: true, // product decision: sponsored student event, no ticket fee

  // `group` drives the visual hierarchy: "primary" facts are the ones a
  // student needs to decide (date, start, place, cost) and get the stronger
  // treatment; "stats" are supporting social proof and stay quieter.
  facts: [
    { group: "primary", label: "Date", value: "30 October 2026" },
    { group: "primary", label: "Time", value: "9:00 AM – 6:00 PM" },
    { group: "primary", label: "Where", value: "IGDTUW Auditorium, Delhi" },
    { group: "primary", label: "Cost", value: "Free for all students", highlight: true },
    { group: "stats", label: "Students", value: "250+" },
    { group: "stats", label: "Talks", value: "9" },
    { group: "stats", label: "Hands-on activities", value: "2" },
    { group: "stats", label: "Professionals", value: "10+" },
  ],

  social: {
    instagram: "https://www.instagram.com/awscloudclubigdtuw",
    linkedin: "https://www.linkedin.com/company/aws-cloud-club-igdtuw/",
    x: "https://x.com/AWSClubIGDTUW?t=Mv5rpAyBkvI8AGfDC6ayoQ&s=09",
    website: "https://aceta-minophen.github.io/aws-cloud-club-igdtuw/",
  },
  credit: "Payal Narwal",
  creditUrl: "https://www.linkedin.com/in/payalnarwal/",
};

/* Speakers — photo, name and role from the existing project assets.
 * LinkedIn links point at each speaker's profile as referenced in the
 * original page. Two sessions ("Career Pathways") share the same title in
 * the source data and are kept as-is until confirmed. */
var SPEAKERS = [
  {
    id: "jen-looper",
    name: "Jen Looper",
    role: "Head of Academic Advocacy at AWS",
    topic: "Two Journeys, One Cloud: Career Pathways",
    level: "all",
    photo: "./assets/Speakers/Jen Looper.png",
    linkedin: "https://www.linkedin.com/in/jenlooper/",
  },
  {
    id: "aditi-sawhney",
    name: "Aditi Sawhney",
    role: "Senior Digital Marketing Manager at AWS",
    topic: "Two Journeys, One Cloud: Career Pathways",
    level: "all",
    photo: "./assets/Speakers/aditi sawhny.jpg",
    linkedin: "https://www.linkedin.com/in/sawhneyaditi/",
  },
  {
    id: "dipali",
    name: "Dipali",
    role: "VP Data Engineering at Natwest Group & AWS Hero",
    topic: "Empowering Future Innovators: Crafting CI/CD pipeline with AWS",
    level: "intermediate",
    photo: "./assets/Speakers/deepali.jpg",
    linkedin: "https://www.linkedin.com/in/dipalik/",
  },
  {
    id: "varsha-verma",
    name: "Varsha Verma",
    role: "Senior Cloud Ops Engineer at Accenture",
    topic: "Unlocking and Mastering the Cloud Basics",
    level: "beginner",
    photo: "./assets/Speakers/VARSHA VERMA.jpeg",
    linkedin: "https://www.linkedin.com/in/varsha-verma-cloud-devops/",
  },
  {
    id: "kristine-howard",
    name: "Kristine Howard",
    role: "AWS DevRel & Advocacy, Asia-Pacific",
    topic: "Generative AI — Asking for a friend",
    level: "beginner",
    photo: "./assets/Speakers/kristine.jpg",
    linkedin: "https://www.linkedin.com/in/kristinehoward/",
  },
  {
    id: "gargee-bhatnagar",
    name: "Gargee Bhatnagar",
    role: "Consultant at Capgemini & AWS Community Builder",
    topic: "AWS Security with Identity and Access Management",
    level: "intermediate",
    photo: "./assets/Speakers/Gargee Bhatnagar.jpg",
    linkedin: "https://linkedin.com/in/gargee-bhatnagar-6b7223114",
  },
  {
    id: "rashmi-nambiar",
    name: "Rashmi Nambiar",
    role: "Principal Marketing Manager, AWS",
    topic: "Making the right moves in a professional landscape",
    level: "all",
    photo: "./assets/Speakers/rashmi.jpg",
    linkedin: "https://www.linkedin.com/in/rashminambiar/",
  },
  {
    id: "payal-gupta",
    name: "Payal Gupta",
    role: "Cloud Engineer at Dremio",
    topic: "Re-Invent recap",
    level: "all",
    photo: "./assets/Speakers/PAYAL GUPTA.JPG",
    linkedin: "https://linkedin.com/in/payal-gupta4639",
  },
  {
    id: "rajani",
    name: "Rajani",
    role: "AWS Community Builder",
    topic: "Climbing the Cloud Ladder: Your AWS Career Guide",
    level: "all",
    photo: "./assets/Speakers/Photo- Rajani.jpg",
    linkedin: "https://linkedin.com/in/rajani103",
  },
];

/* Sessions — one per talk (9 total). Times/rooms/durations are still
 * being finalised, so they're empty by design and render as "TBA".
 * Levels are editorial guidance from the talk titles (a "Cloud Basics"
 * talk is beginner-facing, a "CI/CD pipeline" talk is intermediate). */
var SESSIONS = [
  {
    id: "ssn-cloud-basics",
    speakerId: "varsha-verma",
    time: "",
    duration: "",
    room: "",
    title: "Unlocking and Mastering the Cloud Basics",
    level: "beginner",
    track: "",
    description: "",
    prerequisites: "",
    takeaways: [],
  },
  {
    id: "ssn-career-jen",
    speakerId: "jen-looper",
    time: "",
    duration: "",
    room: "",
    title: "Two Journeys, One Cloud: Career Pathways",
    level: "all",
    track: "",
    description: "",
    prerequisites: "",
    takeaways: [],
  },
  {
    id: "ssn-career-aditi",
    speakerId: "aditi-sawhney",
    time: "",
    duration: "",
    room: "",
    title: "Two Journeys, One Cloud: Career Pathways",
    level: "all",
    track: "",
    description: "",
    prerequisites: "",
    takeaways: [],
  },
  {
    id: "ssn-ci-cd",
    speakerId: "dipali",
    time: "",
    duration: "",
    room: "",
    title: "Empowering Future Innovators: Crafting CI/CD pipeline with AWS",
    level: "intermediate",
    track: "",
    description: "",
    prerequisites: "",
    takeaways: [],
  },
  {
    id: "ssn-generative-ai",
    speakerId: "kristine-howard",
    time: "",
    duration: "",
    room: "",
    title: "Generative AI — Asking for a friend",
    level: "beginner",
    track: "",
    description: "",
    prerequisites: "",
    takeaways: [],
  },
  {
    id: "ssn-security-iam",
    speakerId: "gargee-bhatnagar",
    time: "",
    duration: "",
    room: "",
    title: "AWS Security with Identity and Access Management",
    level: "intermediate",
    track: "",
    description: "",
    prerequisites: "",
    takeaways: [],
  },
  {
    id: "ssn-career-rashmi",
    speakerId: "rashmi-nambiar",
    time: "",
    duration: "",
    room: "",
    title: "Making the right moves in a professional landscape",
    level: "all",
    track: "",
    description: "",
    prerequisites: "",
    takeaways: [],
  },
  {
    id: "ssn-reinvent-recap",
    speakerId: "payal-gupta",
    time: "",
    duration: "",
    room: "",
    title: "Re-Invent recap",
    level: "all",
    track: "",
    description: "",
    prerequisites: "",
    takeaways: [],
  },
  {
    id: "ssn-cloud-ladder",
    speakerId: "rajani",
    time: "",
    duration: "",
    room: "",
    title: "Climbing the Cloud Ladder: Your AWS Career Guide",
    level: "all",
    track: "",
    description: "",
    prerequisites: "",
    takeaways: [],
  },
];

/* Fixed agenda blocks — "doors open" uses the real 9:00 start from the
 * original countdown. There is no closing time in the source data. */
var AGENDA_FIXED = [
  {
    time: "9:00 AM",
    title: "Doors open & check-in",
    note: "Arrival + registration on site",
  },
];

/* Team — names, roles, photos and LinkedIn links preserved verbatim. */
var TEAM = [
  { name: "Arushi Garg", role: "Captain", photo: "./assets/Aws core team/Arushi Garg.jpg", linkedin: "https://www.linkedin.com/in/arushi-garg105" },
  { name: "Soumya", role: "Core", photo: "./assets/Aws core team/soumya_aws.jpg", linkedin: "https://www.linkedin.com/in/soumyavats06" },
  { name: "Priyanka", role: "Core", photo: "./assets/Aws core team/Priyanka.jpeg", linkedin: "https://www.linkedin.com/in/priyanka-mohanty-46b656205/" },
  { name: "Sakshi", role: "Core", photo: "./assets/Aws core team/Sakshi.jpg", linkedin: "https://www.linkedin.com/in/sakshi-s-8130b11b1" },
  { name: "Shreya", role: "Core", photo: "./assets/Aws core team/shreya.jpg", linkedin: "https://www.linkedin.com/in/shreya-gupta-0b6821255" },
  { name: "Lavanaya", role: "Volunteer", photo: "./assets/Members/LAVANAYA PASSPORT SIZE PHOTO.jpg", linkedin: "https://www.linkedin.com/in/lavanaya-khosla-16367026b" },
  { name: "Charu", role: "Volunteer", photo: "./assets/Members/Charu023MIC.jpg", linkedin: "https://www.linkedin.com/in/charu-nigam-59181b256" },
  { name: "Jyati", role: "Volunteer", photo: "./assets/Members/Jyati.jpg", linkedin: "https://www.linkedin.com/in/jyati-agarwal-4b0047283" },
  { name: "Garima", role: "Volunteer", photo: "./assets/Members/garima.jpg", linkedin: "https://www.linkedin.com/in/garima-singh-476377288" },
  { name: "Ananya", role: "Volunteer", photo: "./assets/Members/ananya.PNG", linkedin: "https://www.linkedin.com/in/ananya-taneja-90ab25259" },
  { name: "Aishwarya", role: "Volunteer", photo: "./assets/Members/Aishwarya.jpg", linkedin: "https://www.linkedin.com/in/aishwaryakushwaha/" },
  { name: "Shradha", role: "Volunteer", photo: "./assets/Members/Shradha Jain.jpg", linkedin: "https://www.linkedin.com/in/shradha-jain-8251191b9/" },
  { name: "Gayatri", role: "Volunteer", photo: "./assets/Members/Gayatri Dixit.jpg", linkedin: "https://www.linkedin.com/in/gayatridixit" },
  { name: "Anamika", role: "Volunteer", photo: "./assets/Members/Anamika Rai.jpg", linkedin: "http://www.linkedin.com/in/anamikaraiin" },
  { name: "Arushree", role: "Volunteer", photo: "./assets/Members/Arushree Mishra.PNG", linkedin: "http://www.linkedin.com/in/arushree-mishra-666a13247" },
  { name: "Tvesha", role: "Volunteer", photo: "./assets/Members/Tvesha Singh.jpg", linkedin: "https://www.linkedin.com/in/tvesha-singh/" },
  { name: "Anjali", role: "Volunteer", photo: "./assets/Members/Anjali Dass.jpeg", linkedin: "https://www.linkedin.com/in/anjali-dass-a03019273/" },
  { name: "Aarushi", role: "Volunteer", photo: "./assets/Members/Aarushi Singh.jpg", linkedin: "https://www.linkedin.com/in/aarushi-singh-17302b283" },
  { name: "Aniketa", role: "Volunteer", photo: "./assets/Members/Aniketa.jpg", linkedin: "https://www.linkedin.com/in/aniketakumari/" },
  { name: "Bhavya", role: "Volunteer", photo: "./assets/Members/Bhavya Diwan.jpg", linkedin: "https://www.linkedin.com/in/bhavya-diwan-389b83287" },
  { name: "Jhanvi", role: "Volunteer", photo: "./assets/Members/Jhanvi Madan.jpg", linkedin: "https://www.linkedin.com/in/jhanvi-madan-b4a460201" },
  { name: "Sania", role: "Volunteer", photo: "./assets/Members/Sania Verma.jpg", linkedin: "https://www.linkedin.com/in/sania-verma-21a642291" },
  { name: "Saloni", role: "Volunteer", photo: "./assets/Members/Saloni singh.jpg", linkedin: "https://www.linkedin.com/in/saloni-singh-15963b255" },
  { name: "Tanisha", role: "Volunteer", photo: "./assets/Members/Tanisha.png", linkedin: "https://www.linkedin.com/in/tanisha-monga/" },
  { name: "Sneha", role: "Volunteer", photo: "./assets/Members/sneha.jpg", linkedin: "https://www.linkedin.com/in/sneha-yadav-11a454283" },
  { name: "Avni", role: "Volunteer", photo: "./assets/Members/avni.jpeg", linkedin: "https://www.linkedin.com/in/avni-jain-693971283" },
  { name: "Payal", role: "Volunteer", photo: "./assets/Members/payal2.jpg", linkedin: "https://www.linkedin.com/in/payalnarwal" },
];

/* Event-scoped FAQs. Answers stick to what the project data supports.
 * Anything still unconfirmed is marked TBA rather than invented. */
var FAQS = [
  {
    q: "Is the event free?",
    a: "Yes. AWS Student Community Day is free for all students — there is no registration fee and no ticket to purchase. Registration happens on Konfhub.",
  },
  {
    q: "Who can attend?",
    a: "Any student — IGDTUW or any other college, any branch, any year. The AWS Cloud Club welcomes students of all skill levels.",
  },
  {
    q: "Do I need AWS experience?",
    a: "No. Sessions range from cloud basics to hands-on CI/CD and AI, so there is a starting point for everyone. Beginner-friendly sessions are tagged clearly in the schedule.",
  },
  {
    q: "How do I register?",
    a: "Use the Register button anywhere on this page — it takes you to our Konfhub page where you book your free spot. You'll get a confirmation email with your ticket details.",
  },
  {
    q: "What should I bring on the day?",
    a: "Keep it simple: your student ID, the confirmation email/ticket on your phone, and a charged phone. (Full day-of instructions are being finalised and will be shared before the event.).",
  },
  {
    q: "How do I check in?",
    a: "Check-in opens at 9:00 AM at the IGDTUW Auditorium. Have your confirmation ready and the team will get you in. Exact check-in process will be emailed before the event.",
  },
  {
    q: "Will sessions be recorded?",
    a: "TBA — we'll announce recording and recap plans on the club's Instagram and X. When they're shared, they'll also appear on the club website.",
  },
  {
    q: "Where is the venue?",
    a: "IGDTUW Auditorium, Indira Gandhi Delhi Technical University for Women, Kashmere Gate, Delhi. See the Venue section above and the map link.",
  },
  {
    q: "How do I contact the organisers?",
    a: "Message us on Instagram or X (@AWSClubIGDTUW) — the links are in the footer.",
  },
];