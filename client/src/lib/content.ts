/**
 * ULIX Discovery Workshop Report Content
 * ALL information from the original PDF report, organized for the website
 * 
 * Source: TMC / ULIX Discovery Workshop Report, October 2018
 * Prepared by: Amadeus Customer Solutions, Consolidators & Networks
 * Status: Strictly Confidential & Restricted
 */

export const siteContent = {
  meta: {
    title: "ULIX Discovery Workshop Report",
    subtitle: "Building the Future of Travel Through Technology and Community",
    date: "October 2018",
    preparedBy: "Amadeus Customer Solutions, Consolidators & Networks",
    status: "Strictly Confidential & Restricted",
  },

  hero: {
    title: "ULIX Discovery Workshop Report",
    subtitle: "Transforming Independent Travel Agencies Through Technology",
    description:
      "A comprehensive analysis prepared by Amadeus in October 2018, exploring how ULIX is reshaping the travel landscape across the Balkans region — from a single agency to a full-scale technology and community platform.",
    badge: "October 2018 · Confidential Report",
  },

  vision: {
    title: "Our Vision",
    statement:
      "To create the network of independent Travel agencies and give them the right technology to enable growth.",
    description:
      "ULIX believes in empowering independent travel agencies with the tools, technology, and community support they need to compete and thrive in a rapidly evolving industry. The company operates as a living lab — testing its own systems while serving as a model for the region.",
    cultureQuotes: [
      { quote: "His frustration became his fuel for creativity.", context: "On the founder's early marketing challenges" },
      { quote: "We will build your business without cost for you.", context: "ULIX's offer to partner agencies" },
      { quote: "Movement — you move, you get time off.", context: "The ULIX work culture motto" },
      { quote: "Hand on: do it, learn and adapt.", context: "Sports philosophy applied to business" },
    ],
  },

  keyMetrics: [
    { label: "Annual Turnover", value: "30M EUR", icon: "TrendingUp", color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Total Employees", value: "117 FTEs", icon: "Users", color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Countries Active", value: "4", icon: "Globe", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "B2C Online Revenue", value: "2M EUR", icon: "Zap", color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Sub-Agencies Managed", value: "15+", icon: "Network", color: "text-teal-500", bg: "bg-teal-500/10" },
    { label: "Webinars / Month", value: "2", icon: "Award", color: "text-rose-500", bg: "bg-rose-500/10" },
  ],

  businessReview: {
    title: "Company Journey",
    subtitle: "From Sports to ULIX: A Story of Relentless Innovation",
    sections: [
      {
        heading: "From Sports to Travel: The Founder's Journey",
        year: "Background",
        content:
          "The CEO brings a unique background in sports, mathematics, and economics. His competitive athlete mindset — built on the philosophy of 'do it, learn and adapt' — became the foundation of ULIX's culture. Frustrated by expensive, ineffective traditional marketing (newspapers, billboards), he turned that frustration into fuel for innovation, pioneering guerrilla marketing: banners on balconies, branded cars parked in key locations, and unconventional customer acquisition tactics.",
        image: "/images/history/airplane.png",
        tag: "Foundation",
      },
      {
        heading: "The Birth of ULIX (2001)",
        year: "2001",
        content:
          "ULIX was founded in 2001 with a focus on air travel, a segment the founder found to be 'wide and dynamic' with endless parameters to optimize. The company pivoted away from package holidays after poor early experiences and identified air ticketing as a business with measurable, challenge-worthy potential. Early marketing was entirely guerrilla-style, creating a scrappy, resourceful culture that persists to this day.",
        image: "/images/zagreb_skyline.png",
        tag: "Launch",
      },
      {
        heading: "Air Travel Revolution (2003)",
        year: "2003",
        content:
          "ULIX's bold experiment with free airport transfers became a 10x growth driver. At a time when taxi costs were prohibitive, this completely differentiated the offering. Though the service was eventually discontinued due to the operational complexity of scaling it, this experience cemented ULIX's willingness to test bold ideas, measure outcomes, and iterate — even when it meant shutting something down.",
        image: "/images/history/airplane.png",
        tag: "Breakthrough",
      },
      {
        heading: "Digital Transformation (2009)",
        year: "2009",
        content:
          "ULIX launched AVIOKARTE.HR, its first major online booking engine (IBE). The team embraced Google AdWords early and built strong relationships with the Chinese community in Croatia — a unique niche that required deep trust. A critical insight emerged: in the Balkans, customers needed to trust not just the price, but the legal and operational stability of the company. ULIX responded by investing in transparency and reliability as core brand values.",
        image: "/images/history/digital.png",
        tag: "Online-First",
      },
      {
        heading: "International Expansion (2015)",
        year: "2015",
        content:
          "ULIX expanded into Slovenia and Serbia with localized brands: LETALSKE.SI and AVIOKARTE.ORG. A German IATA license was established to unlock additional carriers and offer special fares to regional customers. Poland followed with LOTEKSPERT.PL. This strategic geographic expansion demonstrated the model's replicability, with each brand tailored to its local market while sharing the same technology backbone.",
        image: "/images/history/global.png",
        tag: "Expansion",
      },
      {
        heading: "From Travel Agency to Technology Company",
        year: "2016–2018",
        content:
          "Recognizing limitations in existing regional tech solutions — where features like EMDs were treated as one-time builds with no ongoing evolution — ULIX began developing its own TMC (Travel Management Core) system. Early regional tech partnerships revealed significant marketplace gaps. Rather than waiting for others to solve them, ULIX built internal solutions. This transition marked the definitive shift from travel agency to a full-scale products and services organization.",
        image: "/images/tech_architecture.png",
        tag: "Tech-First",
      },
    ],
  },

  businessModel: {
    title: "Business Model Canvas",
    subtitle: "A full picture of how ULIX creates, delivers, and captures value",

    keyPartners: {
      label: "Key Partners",
      items: [
        "Travel Agencies & Consolidators (AER Tickets, ETraveli)",
        "Corporate Clients",
        "GDSs — Travelport, Amadeus (Galileo)",
        "Airlines",
        "Technology Partners (Ypsilon, Anix)",
        "AIESEC — Exchange student programs",
        "Travelport — Hackathon collaborations",
        "Serbia Airlines — Co-working partnership",
      ],
    },

    keyActivities: {
      label: "Key Activities",
      items: [
        "Consolidator Travel Services (ticketing, reissues, refunds)",
        "IT & Technology Development (TMC system)",
        "Customer Service Outsourcing (24h resumption capability)",
        "Self-Booking Tool operation",
        "Community Events, Webinars & Education",
        "Corporate Booking & Reporting",
        "TMC Queue & Touchless Ticketing",
      ],
    },

    valuePropositions: {
      label: "Value Propositions",
      items: [
        {
          segment: "Travel Agencies",
          value:
            "Easy-to-use technology that improves business efficiency while preserving the agency's independence and brand",
          icon: "Globe",
        },
        {
          segment: "Corporate Clients",
          value:
            "Comprehensive IT solutions for travel management, cost control, invoicing, and system integration (SAP, etc.)",
          icon: "Briefcase",
        },
        {
          segment: "Consumers (B2C)",
          value:
            "Best price guarantees, technology-enabled booking across air, hotel, car, and transfer, with professional support",
          icon: "Star",
        },
        {
          segment: "Employees",
          value:
            "Entrepreneurial opportunities backed by company infrastructure: 'Find your own business and we'll support you with money and technology'",
          icon: "Rocket",
        },
      ],
    },

    revenueStreams: {
      label: "Revenue Streams",
      total: "30M EUR Total Turnover",
      items: [
        { label: "Ticket Processing Fees", percent: 70, color: "#0F766E", description: "Core ticketing revenue across all brands" },
        { label: "Hotels & MICE", percent: 30, color: "#F97316", description: "Meetings, Incentives, Conferences & Exhibitions" },
        { label: "Airline Incentives", percent: 15, color: "#14B8A6", description: "Performance-based airline partnerships" },
        { label: "GDS Incentives", percent: 15, color: "#6366F1", description: "Travelport and Amadeus volume incentives" },
        { label: "Online B2C Revenue", value: "2M EUR", color: "#EC4899", description: "Growing direct consumer channel" },
      ],
    },

    keyResources: {
      label: "Key Resources",
      items: [
        { label: "People", detail: "117 FTEs total — 70 in Croatia, 47 in Serbia" },
        { label: "Tech Team", detail: "3 TMC developers, 7 call center agents, dedicated IT team" },
        { label: "Brands", detail: "AVIOKARTE.HR · LETALSKE.SI · AVIOKARTE.ORG · LOTEKSPERT.PL" },
        { label: "Infrastructure", detail: "Cloud-hosted TMC system (Cratis), 3 GDS connections, modular offices" },
        { label: "Community", detail: "Travel Technology Hub, biweekly webinars, hackathon partnerships" },
      ],
    },

    customerSegments: {
      label: "Customer Segments",
      items: [
        { segment: "B2C Consumers", detail: "Direct online booking via branded portals" },
        { segment: "B2B Corporate", detail: "Managed travel programs for businesses" },
        { segment: "Partner Agencies", detail: "15 sub-agencies + 15 travel agencies using TMC" },
        { segment: "Home-Based Agents", detail: "Independent agents using TMC system infrastructure" },
      ],
    },
  },

  productStrategy: {
    title: "Products & Services",
    subtitle: "A portfolio built from real operational pain — and solved with technology",
    sections: [
      {
        heading: "TMC System: Travel Management Core",
        icon: "Code",
        content:
          "ULIX developed the TMC system by generalizing its own operational processes. Built on PHP, MySQL, MongoDB, and Elasticsearch, hosted on Cratis cloud, it serves corporations, sub-agencies, and home-based agents. Core modules include: Commission Engine, Finance Tool, Invoicing, Quality Control, Ticketing, PNR Modification, Profiles, and BackOffice. The system directly serves 15 sub-agencies and 15 travel agencies with full ticketing queues.",
        tags: ["PHP", "MySQL", "MongoDB", "Elasticsearch", "Cloud-Hosted"],
      },
      {
        heading: "Travel Agency as a Service",
        icon: "Headphones",
        content:
          "ULIX offers customer service outsourcing to agencies in distress. By sharing call center staff, GDS terminals, and office infrastructure, ULIX can have a struggling agency back online within 24 hours. This model provides immediate operational rescue and gives smaller agencies access to proven enterprise-grade systems without the capital investment.",
        tags: ["Outsourcing", "24h Resumption", "Shared Infrastructure"],
      },
      {
        heading: "Self-Booking Tools",
        icon: "MousePointer",
        content:
          "ULIX built self-booking solutions for corporate customers and the broader Balkan regional market. These interfaces empower end consumers and travel managers to search, book, and manage itineraries independently, while still having access to ULIX's pricing, service, and support ecosystem. Tight integration with the TMC ensures full back-office visibility.",
        tags: ["SBT", "Corporate", "B2C"],
      },
      {
        heading: "Community Education & Webinars",
        icon: "BookOpen",
        content:
          "ULIX hosts biweekly webinars covering GDS systems, airline updates, and travel industry trends. These sessions serve both travel professionals and general consumers, positioning ULIX as the authoritative voice and trusted advisor for the Balkan travel ecosystem. Conferences and community events further cement this thought leadership role.",
        tags: ["Biweekly", "GDS Training", "Industry Thought Leadership"],
      },
    ],
  },

  travelHub: {
    title: "Travel & Technology Hub",
    description: "A Physical Platform for Community and Innovation",
    content:
      "ULIX created a Travel Technology Hub in Zagreb to bring together the Balkan travel community and provide a launchpad for startups. What started as an operational need became a strategic differentiator — a physical space that signals ULIX's community mission and creates gravitational pull for partners, talent, and collaborators.",
    features: [
      "Co-working space for airlines and travel startups, including Serbia Airlines",
      "AIESEC exchange student hosting for travel internship programs",
      "Industry events and conferences for the travel and tech communities",
      "Hackathons organized in direct collaboration with Travelport",
      "A collaborative environment where partners, startups, and agencies co-create",
    ],
    futureVision:
      "ULIX is in active conversations with Amadeus to establish a travel co-innovation hub — expanding the model to Bosnia and other Balkan markets, creating a regional network of innovation hubs where startups and established players collaborate and grow together.",
    image: "/images/innovation_hub.png",
  },

  systemsOverview: {
    title: "Technology Architecture",
    subtitle: "How ULIX's systems connect content, operations, and customers",
    description:
      "ULIX operates a comprehensive technology stack serving multiple customer segments simultaneously. The architecture layers GDS connections, LCC integrations, and a custom TMC core to power both consumer-facing brands and agency back-office operations.",
    contentSources: [
      { name: "Amadeus GDS", category: "GDS", color: "#0F766E", description: "Global full-service carrier inventory and booking" },
      { name: "Travelport / Galileo", category: "GDS", color: "#0F766E", description: "Second GDS connection for carrier diversity" },
      { name: "Ypsilon", category: "LCC", color: "#F97316", description: "Low-cost carrier aggregator" },
      { name: "ANIX", category: "LCC", color: "#F97316", description: "Additional LCC connectivity platform" },
      { name: "AutoEurope", category: "Cars", color: "#6366F1", description: "Car rental integration" },
      { name: "Hotel Aggregators", category: "Hotels", color: "#EC4899", description: "Hotel inventory access" },
    ],
    tmcModules: [
      "Commission Engine",
      "Finance Tool & Invoicing",
      "Quality Control (QC)",
      "Ticketing & PNR Modification",
      "Agent Profiles",
      "BackOffice Management",
      "Queue Management",
      "Auto-ticketing",
      "Schedule Change Notifications",
    ],
    b2cBrands: [
      { name: "AVIOKARTE.HR", country: "Croatia", flag: "🇭🇷" },
      { name: "LETALSKE.SI", country: "Slovenia", flag: "🇸🇮" },
      { name: "AVIOKARTE.ORG", country: "Serbia", flag: "🇷🇸" },
      { name: "LOTEKSPERT.PL", country: "Poland", flag: "🇵🇱" },
    ],
    image: "/images/tech_architecture.png",
  },

  amadeus: {
    title: "About Amadeus",
    subtitle: "Partner in the Discovery Workshop",
    description:
      "Amadeus is the world's leading technology company dedicated to the global travel industry. The company's solutions enrich travel for billions of people every year, connecting airlines, hotels, rail operators, and travel agencies through a single, flexible platform.",
    stats: [
      { label: "Global Ranking", value: "Top 10 Software Companies" },
      { label: "Passengers Boarded (2017)", value: "1.6+ billion" },
      { label: "Bookings Processed (2017)", value: "630+ million" },
      { label: "Global Presence", value: "190+ countries" },
      { label: "Employees Worldwide", value: "17,000+" },
      { label: "Stock Index", value: "Euro Stoxx 50" },
      { label: "DJSI", value: "7 consecutive years — World #1 in Software & Services" },
    ],
    vision: "Live Travel Space",
    visionDescription:
      "Amadeus is transitioning from a traditional GDS to a 'Live Travel Space' — an open, flexible platform that connects providers and sellers via NDC, APIs, and classic GDS pipes. This vision shapes the recommendations developed for ULIX's growth.",
    specializations: [
      "Mega Travel Management Companies",
      "Online Travel Companies",
      "Networks & Consolidators (ULIX's segment)",
      "Leisure Travel Ecosystems",
    ],
  },

  amadeusPillars: {
    title: "Amadeus Recommendations for ULIX",
    subtitle: "Four pillars to boost conversion and operational efficiency",
    pillars: [
      {
        name: "Exhaustiveness",
        icon: "Database",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        description:
          "Expand the content portfolio: integrate Hotels, Cars, Transfers, Insurance, and 80+ Low-Cost Carriers via Pyton API. Ensure ULIX's search covers maximum available inventory.",
        actions: [
          "Integrate Hotels, Cars & Transfers content",
          "Connect 80+ LCCs via Pyton API",
          "Enable Virtual Interlining for non-interline route combinations",
          "Add Insurance products to booking flow",
        ],
      },
      {
        name: "Accuracy",
        icon: "Target",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        description:
          "Improve flight search relevance and precision via Master Pricer enhancements: calendar view, multi-ticket weighting, alternate airport search, and sub-second Instant Search results.",
        actions: [
          "Master Pricer: Calendar view & alternate airports",
          "Multi-ticket weighting for optimal combinations",
          "Instant Search with pre-computed cache (sub-second response)",
          "Improve ancillary adoption (bags, seats) — currently 2.7pp below benchmark",
        ],
      },
      {
        name: "Accessibility",
        icon: "Smartphone",
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        description:
          "Make the booking experience available anywhere, anytime via a Mobile White Label app for itinerary management, flight notifications, and on-the-go booking.",
        actions: [
          "Mobile White Label app deployment",
          "Push notifications for flight changes",
          "On-the-go itinerary management",
          "Seamless link between mobile and desktop sessions",
        ],
      },
      {
        name: "Performance",
        icon: "Zap",
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        description:
          "Automate operational workflows using Amadeus Productivity Suite: Smart Flows, Smart Triggers, Quality Monitor, and Amadeus Ticket Changer (ATC) for automated reissues, refunds, and cancellations.",
        actions: [
          "Smart Flows & Smart Triggers automation",
          "Quality Monitor for PNR compliance",
          "Amadeus Ticket Changer (ATC) for automated reissues/refunds",
          "B2B Wallet for virtual card payment & reconciliation",
        ],
      },
    ],
  },

  challenges: {
    title: "Current Challenges",
    items: [
      {
        title: "Credit & Financial Risk Management",
        description:
          "ULIX faces credit exposure challenges as the business scales across multiple markets. Managing financial risk while extending credit to partner agencies requires robust systems and policies not yet fully in place.",
        severity: "high",
      },
      {
        title: "Culture & Talent Acquisition",
        description:
          "Maintaining a startup mentality and hands-on culture while scaling is genuinely difficult. Finding exceptional UX talent and other key technical roles is competitive, and ULIX is actively working to attract and retain the right people.",
        severity: "medium",
      },
      {
        title: "Manual TMC Processes",
        description:
          "Currently managing 15 sub-agencies and 15 travel agencies through ticketing queues that are largely manual. Touchless ticketing and process automation represent significant untapped efficiency gains.",
        severity: "high",
      },
      {
        title: "Revenue Scaling",
        description:
          "Growing revenue across multiple markets and service lines while maintaining operational quality and efficiency is a constant challenge. The B2C channel (2M EUR) has strong potential but requires further investment.",
        severity: "medium",
      },
      {
        title: "Ancillary Adoption",
        description:
          "ULIX's adoption rate for ancillary services (seat selection, baggage add-ons) currently sits 2.7 percentage points below industry benchmarks. This represents both a gap and a near-term revenue opportunity.",
        severity: "low",
      },
    ],
  },

  opportunities: {
    title: "Strategic Opportunities",
    items: [
      {
        title: "Corporate Booking Tool (Priority #1)",
        description:
          "The highest-priority near-term initiative. Corporate clients increasingly need efficient, integrated travel management partners. A dedicated corporate self-booking tool with reporting, policy compliance, and SAP integration would significantly expand the addressable market.",
        priority: "Immediate",
      },
      {
        title: "TMC Market Leadership in the Balkans",
        description:
          "No comprehensive travel management platform truly serves the Balkan market. ULIX's TMC, already serving 30 agencies, is positioned to become the de-facto standard for the region — a significant moat if executed well.",
        priority: "Near-Term",
      },
      {
        title: "Travel Hub Network Expansion",
        description:
          "The Travel Technology Hub model — co-working, events, hackathons — can be replicated in Bosnia and other regional markets. Combined with the Amadeus co-innovation hub discussions, this creates a powerful community flywheel.",
        priority: "Mid-Term",
      },
      {
        title: "300–500 Universe Scale",
        description:
          "ULIX's long-term vision is to power 300–500 instances of its core system serving different travel agency networks globally. This SaaS-style distribution model would transform ULIX from a regional player to a global platform.",
        priority: "Long-Term",
      },
      {
        title: "LCC Expansion via Pyton API",
        description:
          "Connecting 80+ low-cost carriers through the Amadeus Pyton API would dramatically expand content breadth and make ULIX the most exhaustive search option in the region, closing a gap vs. OTAs.",
        priority: "Near-Term",
      },
    ],
  },

  strategy: {
    title: "Strategic Direction",
    shortTerm: {
      heading: "Short Term — This Year & Next",
      color: "primary",
      initiatives: [
        "Launch Corporate Booking Tool (Priority #1) to capture growing corporate market demand",
        "Integrate analytics with corporate customer systems (SAP, ERP platforms)",
        "Develop technology in collaboration with industry advisors including Amadeus",
        "Promote conferences and events to drive community and thought leadership",
        "Expand the TMC network and actively communicate the platform strategy",
        "Improve ancillary adoption to close the 2.7pp gap vs. benchmark",
        "Maintain culture: 'Movement — you move, you get time off'",
      ],
    },
    longTerm: {
      heading: "Long Term — 3 to 5 Years",
      color: "accent",
      initiatives: [
        "Generate 300–500 universes: instances of the core system serving different travel agency networks",
        "Establish ULIX as the leading travel technology platform for the Balkans and beyond",
        "Expand internationally through partnerships with local players in new markets",
        "Build a thriving ecosystem where independent agencies compete and grow together",
        "Establish Travel Hub Network across Bosnia and additional Balkan markets",
        "Maintain entrepreneurial culture and community-first approach at scale",
      ],
    },
  },

  processesOverview: {
    title: "Operations & Processes",
    description:
      "ULIX operates with efficiency and scalability in mind, constantly using itself as a live testing ground for its own TMC product.",
    highlights: [
      { item: "Google Suite", detail: "Full integration for productivity, collaboration, and document management" },
      { item: "Living Lab Model", detail: "ULIX's own operations are the primary test environment for TMC features" },
      { item: "Modular Offices", detail: "Scalable office infrastructure enabling rapid market entry" },
      { item: "Lean Teams", detail: "Small, well-defined teams that move fast and handle tasks with full ownership" },
      { item: "Automation Roadmap", detail: "Significant room for improvement in touchless ticketing and customer service automation" },
      { item: "24h Agency Rescue", detail: "Ability to bring struggling agency back online within 24 hours via shared infrastructure" },
    ],
  },
};

export const navigationItems = [
  { label: "Overview", id: "overview" },
  { label: "Vision", id: "vision" },
  { label: "Journey", id: "business" },
  { label: "Business Model", id: "business-model" },
  { label: "Products", id: "products" },
  { label: "Tech", id: "systems" },
  { label: "Hub", id: "hub" },
  { label: "Amadeus", id: "amadeus" },
  { label: "Strategy", id: "strategy" },
  { label: "Challenges", id: "challenges" },
];
