export const TECH_LIST = [
  // Languages
  "Python", "Java", "JavaScript", "TypeScript", "C", "C++", "C#", "Go", "Rust",
  "Kotlin", "Swift", "PHP", "Ruby", "Dart",
  // Frontend
  "React", "Next.js", "Vue", "Angular", "Svelte", "HTML", "CSS", "Tailwind", "Bootstrap", "Redux",
  // Backend
  "Node.js", "Express", "Django", "Flask", "FastAPI", "Spring Boot", ".NET", "Laravel",
  // AI/ML
  "TensorFlow", "PyTorch", "Keras", "Scikit-learn", "Hugging Face", "OpenCV",
  "Pandas", "NumPy", "LangChain",
  // Databases
  "MongoDB", "MySQL", "PostgreSQL", "Redis", "Firebase", "Supabase", "SQLite",
  // Cloud/DevOps
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "GitHub Actions",
  // Data
  "Spark", "PySpark", "Hadoop", "Kafka", "Power BI", "Tableau",
  // Cybersecurity
  "Wireshark", "Burp Suite", "Metasploit", "Nmap", "Linux",
  // Blockchain
  "Solidity", "Ethereum", "Web3.js", "Hardhat",
]

export const ROLE_LIST = [
  // Software / engineering
  "Software Developer", "Software Engineer", "Full Stack Developer", "Frontend Developer",
  "Backend Developer", "Web Developer", "Mobile Developer", "iOS Developer", "Android Developer",
  "Game Developer", "Embedded Systems Engineer", "Firmware Engineer", "Systems Engineer",
  "Platform Engineer", "Infrastructure Engineer", "QA Engineer", "Test Engineer",
  "Site Reliability Engineer", "DevOps Engineer", "Cloud Engineer", "Solutions Architect",
  "Technical Lead", "Engineering Manager", "CTO",
  // AI / ML / Data
  "ML Engineer", "Machine Learning Engineer", "ML Researcher", "ML Developer",
  "AI Engineer", "AI/ML Engineer", "Applied ML Engineer", "AI Researcher",
  "Computer Vision Engineer", "NLP Engineer", "Deep Learning Engineer",
  "Data Scientist", "Data Analyst", "Data Engineer", "Data Researcher", "ML/Data Engineer",
  "Research Scientist", "Quant Researcher", "Quant Developer",
  // Design
  "Product Designer", "UI Designer", "UX Designer", "UI/UX Designer", "Visual Designer",
  "Interaction Designer", "Motion Designer", "Graphic Designer", "Brand Designer",
  "Design Engineer", "Creative Technologist",
  // Product / business
  "Product Manager", "Product Owner", "Program Manager", "Project Manager",
  "Growth Hacker", "Growth Marketer", "Marketing Lead", "Community Manager",
  "Founder", "Co-Founder", "Indie Hacker", "Solopreneur",
  // Security / blockchain / infra
  "Cybersecurity Engineer", "Security Researcher", "Penetration Tester", "Security Analyst",
  "Blockchain Developer", "Smart Contract Developer", "Web3 Developer", "Protocol Engineer",
  "Network Engineer", "Database Administrator",
  // Hardware / robotics
  "Robotics Engineer", "Hardware Engineer", "IoT Engineer", "Electrical Engineer",
  "Mechatronics Engineer",
  // Learning / other
  "Student / Builder", "Researcher", "Freelance Developer", "Open Source Contributor",
  "Technical Writer", "Developer Advocate", "Developer Relations", "Hackathon Regular",
  "Bio-Tech Engineer", "Fintech Engineer", "EdTech Builder", "Climate Tech Builder",
]

// Prefix + substring match, case-insensitive, sorted so prefix hits come first.
export function suggest(list, query, max = 5) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const starts = list.filter((item) => item.toLowerCase().startsWith(q))
  const includes = list.filter(
    (item) => !item.toLowerCase().startsWith(q) && item.toLowerCase().includes(q)
  )
  return [...starts, ...includes].slice(0, max)
}
