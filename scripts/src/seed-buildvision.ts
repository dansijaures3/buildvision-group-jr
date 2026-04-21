import {
  db,
  heroSlides,
  services,
  projects,
  events,
  commerceItems,
  teamMembers,
  blogPosts,
  partners,
  testimonials,
} from "@workspace/db";

async function main() {
  console.log("Seeding BuildVision database...");

  await db.delete(heroSlides);
  await db.delete(services);
  await db.delete(projects);
  await db.delete(events);
  await db.delete(commerceItems);
  await db.delete(teamMembers);
  await db.delete(blogPosts);
  await db.delete(partners);
  await db.delete(testimonials);

  await db.insert(heroSlides).values([
    {
      image:
        "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=2000&q=80",
      title: "BUILDVISION GROUP & JR SERVICE",
      subtitle: "Architecture | Construction | Événementiel | Commerce",
      button1Text: "Voir nos projets",
      button1Link: "/projets",
      button2Text: "Demander un devis",
      button2Link: "/devis",
      displayOrder: 1,
      isActive: true,
    },
    {
      image:
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=2000&q=80",
      title: "Bâtir l'avenir avec précision",
      subtitle: "Génie civil et grands ouvrages — l'excellence à chaque étape",
      button1Text: "Nos services",
      button1Link: "/services",
      button2Text: "Nos chantiers",
      button2Link: "/projets",
      displayOrder: 2,
      isActive: true,
    },
    {
      image:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=2000&q=80",
      title: "Des événements à la hauteur de vos ambitions",
      subtitle: "Production événementielle premium signée JR Service",
      button1Text: "Découvrir l'événementiel",
      button1Link: "/evenementiel",
      button2Text: "Nous contacter",
      button2Link: "/contact",
      displayOrder: 3,
      isActive: true,
    },
    {
      image:
        "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=2000&q=80",
      title: "Architecture qui dure",
      subtitle: "Pensée pour le climat, conçue pour les générations",
      button1Text: "Pôle Architecture",
      button1Link: "/services/architecture",
      button2Text: "Devis express",
      button2Link: "/devis",
      displayOrder: 4,
      isActive: true,
    },
  ]);

  await db.insert(services).values([
    {
      slug: "architecture",
      title: "Architecture",
      category: "architecture",
      shortDescription:
        "Conception architecturale durable, du concept à la livraison.",
      fullDescription:
        "Notre pôle Architecture conçoit des bâtiments résidentiels, tertiaires et institutionnels qui marient esthétique contemporaine, performance énergétique et ancrage culturel. De l'esquisse aux plans d'exécution, nous orchestrons chaque détail avec rigueur.",
      icon: "building",
      image:
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80",
      features: [
        "Études de faisabilité et programmation",
        "Conception architecturale et plans d'exécution",
        "Modélisation BIM et rendus 3D photoréalistes",
        "Direction de chantier architecturale",
        "Conformité réglementaire et urbanisme",
      ],
      displayOrder: 1,
    },
    {
      slug: "construction",
      title: "Construction & Génie Civil",
      category: "construction",
      shortDescription:
        "Réalisation d'ouvrages structurants : bâtiments, routes, ponts, infrastructures.",
      fullDescription:
        "BuildVision Group exécute des chantiers de construction et de génie civil de toutes tailles, avec une expertise solide en bâtiments résidentiels, équipements publics, infrastructures routières et ouvrages d'art. Nos équipes terrain conjuguent maîtrise technique et respect des délais.",
      icon: "hard-hat",
      image:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80",
      features: [
        "Bâtiments résidentiels et tertiaires",
        "Infrastructures routières et VRD",
        "Ouvrages d'art et fondations spéciales",
        "Réhabilitation et rénovation lourde",
        "Études techniques et suivi qualité",
      ],
      displayOrder: 2,
    },
    {
      slug: "evenementiel",
      title: "Événementiel",
      category: "evenementiel",
      shortDescription:
        "Conception et production d'événements premium, B2B et institutionnels.",
      fullDescription:
        "JR Service, division événementielle du groupe, conçoit et produit des événements clés en main : conférences, lancements, galas, mariages d'exception, salons professionnels. De la scénographie à la régie technique, nous livrons des expériences inoubliables.",
      icon: "sparkles",
      image:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=80",
      features: [
        "Conception scénographique sur-mesure",
        "Régie technique son, lumière, vidéo",
        "Production logistique complète",
        "Gestion d'invités et accueil VIP",
        "Captation et live streaming",
      ],
      displayOrder: 3,
    },
    {
      slug: "commerce",
      title: "Commerce",
      category: "commerce",
      shortDescription:
        "Distribution de matériaux et équipements pour vos projets.",
      fullDescription:
        "Notre pôle Commerce distribue matériaux de construction, mobilier d'événementiel et équipements techniques sélectionnés auprès des meilleurs fabricants. Nous accompagnons nos clients de la sélection à la livraison sur site.",
      icon: "shopping-bag",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80",
      features: [
        "Matériaux de construction premium",
        "Mobilier événementiel et tentes",
        "Équipements techniques son et lumière",
        "Logistique et livraison sur chantier",
        "Conseil et devis personnalisé",
      ],
      displayOrder: 4,
    },
  ]);

  await db.insert(projects).values([
    {
      code: "BV-2025-014",
      title: "Tour Horizon — Plateau Business District",
      category: "architecture",
      description:
        "Conception et réalisation d'une tour de bureaux R+18 de 28 000 m² intégrant des standards HQE et une façade bioclimatique. Le projet articule rigueur structurelle, transparence visuelle et signature urbaine forte au cœur du quartier d'affaires.",
      coverImage:
        "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&q=80",
      ],
      client: "Plateau Real Estate Holding",
      location: "Plateau, Abidjan",
      status: "termine",
      completedAt: "2025-09",
      featured: true,
    },
    {
      code: "BV-2024-008",
      title: "Échangeur de Yopougon — Phase II",
      category: "construction",
      description:
        "Construction d'un échangeur urbain à deux niveaux comprenant 4 km de voirie nouvelle, deux ouvrages d'art et un système de drainage complet. Livré dans les délais avec un bilan sécurité exemplaire.",
      coverImage:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80",
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=80",
        "https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?w=1600&q=80",
      ],
      client: "Ministère des Infrastructures",
      location: "Yopougon, Abidjan",
      status: "termine",
      completedAt: "2024-12",
      featured: true,
    },
    {
      code: "JR-2025-022",
      title: "Sommet Africain de l'Innovation 2025",
      category: "evenementiel",
      description:
        "Production complète d'un sommet international de 1 800 participants : scénographie, régie technique, accueil délégations, captation multi-caméras et diffusion en direct.",
      coverImage:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=80",
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1600&q=80",
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80",
      ],
      client: "Fondation African Tech",
      location: "Sofitel Hôtel Ivoire, Abidjan",
      status: "termine",
      completedAt: "2025-06",
      featured: true,
    },
    {
      code: "BV-2025-031",
      title: "Résidence Les Palmiers — Cocody",
      category: "architecture",
      description:
        "Programme résidentiel haut de gamme de 64 logements répartis sur 6 niveaux, avec piscine partagée, jardin tropical et espaces de coworking en rooftop.",
      coverImage:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80",
      ],
      client: "Cocody Living SA",
      location: "Cocody, Abidjan",
      status: "en_cours",
      completedAt: "2026-03",
      featured: true,
    },
    {
      code: "BV-2025-005",
      title: "Centre commercial Riviera Park",
      category: "commerce",
      description:
        "Aménagement intérieur et fourniture mobilier d'un centre commercial de 12 000 m² accueillant 80 enseignes premium.",
      coverImage:
        "https://images.unsplash.com/photo-1567449303078-57ad995bd17f?w=1600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1567449303078-57ad995bd17f?w=1600&q=80",
      ],
      client: "Riviera Mall Investors",
      location: "Riviera, Abidjan",
      status: "termine",
      completedAt: "2025-04",
      featured: false,
    },
    {
      code: "JR-2024-019",
      title: "Gala annuel Banque Atlantique",
      category: "evenementiel",
      description:
        "Production d'un gala d'entreprise de 600 invités avec scénographie immersive, dîner gastronomique et show artistique.",
      coverImage:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80",
      ],
      client: "Banque Atlantique CI",
      location: "Hôtel Pullman, Abidjan",
      status: "termine",
      completedAt: "2024-11",
      featured: false,
    },
    {
      code: "BV-2026-001",
      title: "Pont sur la Lagune Ébrié",
      category: "construction",
      description:
        "Étude et construction d'un pont haubané de 1,2 km reliant deux quartiers stratégiques. Phase d'études en cours.",
      coverImage:
        "https://images.unsplash.com/photo-1474401046991-1f63396a4f5b?w=1600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1474401046991-1f63396a4f5b?w=1600&q=80",
      ],
      client: "AGEROUTE",
      location: "Lagune Ébrié, Abidjan",
      status: "en_cours",
      completedAt: "2027-12",
      featured: false,
    },
  ]);

  await db.insert(events).values([
    {
      title: "Sommet Africain de l'Innovation 2025",
      description:
        "Production complète : scénographie, régie technique, accueil VIP et captation multi-caméras pour 1 800 participants venus de 25 pays.",
      image:
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1600&q=80",
      location: "Hôtel Ivoire, Abidjan",
      eventDate: "2025-06-12",
      attendees: 1800,
      category: "Conférence internationale",
    },
    {
      title: "Gala annuel Banque Atlantique",
      description:
        "Soirée de prestige avec scénographie immersive, dîner gastronomique et show live, conçue pour célébrer 50 ans d'engagement bancaire.",
      image:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80",
      location: "Hôtel Pullman, Abidjan",
      eventDate: "2024-11-22",
      attendees: 600,
      category: "Gala d'entreprise",
    },
    {
      title: "Mariage K. & A. — Domaine Bingerville",
      description:
        "Mariage d'exception sur 3 jours : cérémonie traditionnelle, dîner cocktail bord de lagune et soirée dansante avec scénographie florale signature.",
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
      location: "Domaine de Bingerville",
      eventDate: "2025-02-15",
      attendees: 320,
      category: "Mariage premium",
    },
    {
      title: "Lancement nouvelle gamme Africell",
      description:
        "Conférence de presse et soirée VIP pour le lancement régional d'une gamme produit télécom, avec écran LED géant et performances live.",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80",
      location: "Sofitel Abidjan",
      eventDate: "2025-04-08",
      attendees: 450,
      category: "Lancement produit",
    },
  ]);

  await db.insert(commerceItems).values([
    {
      name: "Tente structure 10x20 m",
      description:
        "Tente événementielle haut de gamme avec parois transparentes, idéale pour réceptions de 200 personnes.",
      image:
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=80",
      price: "Sur devis",
      category: "Mobilier événementiel",
      available: true,
    },
    {
      name: "Pack régie son & lumière premium",
      description:
        "Console L-Acoustics, lyres LED 250W, console lumière MA Lighting — idéal pour conférences et galas.",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&q=80",
      price: "Sur devis",
      category: "Équipement technique",
      available: true,
    },
    {
      name: "Ciment portland CEM I 42.5",
      description:
        "Ciment haute performance livré en sacs de 50 kg ou en vrac, conforme aux normes CE.",
      image:
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1600&q=80",
      price: "Sur devis",
      category: "Matériaux de construction",
      available: true,
    },
    {
      name: "Mobilier de salon design",
      description:
        "Collection de canapés, fauteuils et tables basses pour aménagement bureaux et lounges.",
      image:
        "https://images.unsplash.com/photo-1567449303078-57ad995bd17f?w=1600&q=80",
      price: "Sur devis",
      category: "Mobilier intérieur",
      available: true,
    },
  ]);

  await db.insert(teamMembers).values([
    {
      name: "Jean-Roger Bamba",
      role: "Président Directeur Général",
      department: "Direction",
      photo:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
      bio: "Plus de 22 ans à la tête de projets structurants en Afrique de l'Ouest. Fondateur de BuildVision Group et de JR Service.",
      linkedin: "https://linkedin.com",
      email: "direction@buildvision.ci",
      displayOrder: 1,
    },
    {
      name: "Aïcha Koné",
      role: "Directrice Architecture",
      department: "Architectes",
      photo:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
      bio: "Architecte DPLG, spécialisée en bâtiments tertiaires bioclimatiques. Pilote 12 architectes au sein du pôle.",
      email: "a.kone@buildvision.ci",
      displayOrder: 2,
    },
    {
      name: "Mohamed Traoré",
      role: "Directeur Génie Civil",
      department: "Ingénieurs",
      photo:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      bio: "Ingénieur ESTP, expert en ouvrages d'art. A piloté plus de 40 chantiers d'infrastructure en 18 ans de carrière.",
      linkedin: "https://linkedin.com",
      displayOrder: 3,
    },
    {
      name: "Fatou Diallo",
      role: "Responsable Événementiel",
      department: "Événementiel",
      photo:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80",
      bio: "Production exécutive de plus de 200 événements premium : galas, conférences internationales, mariages haut de gamme.",
      email: "f.diallo@jrservice.ci",
      displayOrder: 4,
    },
    {
      name: "Kouadio N'Guessan",
      role: "Directeur Commercial",
      department: "Direction",
      photo:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&q=80",
      bio: "Pilote la division Commerce et les partenariats stratégiques avec les grandes entreprises de la sous-région.",
      linkedin: "https://linkedin.com",
      displayOrder: 5,
    },
    {
      name: "Marie-Claire Yao",
      role: "Architecte Senior",
      department: "Architectes",
      photo:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80",
      bio: "Spécialiste résidentiel premium et hôtellerie. Diplômée de l'École d'Architecture de Versailles.",
      displayOrder: 6,
    },
    {
      name: "Ibrahim Sangaré",
      role: "Ingénieur Structures",
      department: "Ingénieurs",
      photo:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80",
      bio: "Calcul de structures béton armé et charpente métallique pour bâtiments de grande hauteur.",
      displayOrder: 7,
    },
    {
      name: "Awa Bakayoko",
      role: "Cheffe de Projet Événementiel",
      department: "Événementiel",
      photo:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
      bio: "Coordination de A à Z d'événements corporate, de la conception scénographique à la régie sur site.",
      displayOrder: 8,
    },
  ]);

  await db.insert(blogPosts).values([
    {
      slug: "construire-en-zone-tropicale-2026",
      title: "Construire en zone tropicale : 5 enjeux pour 2026",
      excerpt:
        "Climat, normes, matériaux : ce qui change réellement dans la conception des bâtiments en Afrique de l'Ouest cette année.",
      content:
        "L'année 2026 marque un tournant pour la construction en zone tropicale. Entre l'évolution des standards HQE adaptés au climat humide, l'arrivée de matériaux biosourcés locaux et le renforcement des exigences parasismiques, les maîtres d'ouvrage doivent repenser leurs cahiers des charges. Cet article passe en revue les cinq défis majeurs que nos équipes adressent au quotidien sur les chantiers du groupe.",
      coverImage:
        "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80",
      author: "Aïcha Koné",
      publishedAt: "2026-03-12",
      tags: ["Architecture", "Climat", "Réglementation"],
    },
    {
      slug: "evenementiel-premium-secrets-regie",
      title: "Événementiel premium : les secrets d'une régie sans accroc",
      excerpt:
        "Du brief client au coup de gong final, comment JR Service orchestre la complexité technique d'un grand événement.",
      content:
        "La réussite d'un événement de 1 000 invités tient à 1 000 micro-décisions invisibles. Notre équipe partage ses meilleures pratiques pour anticiper l'imprévu, sécuriser la régie son et lumière, et offrir aux invités l'expérience que les organisateurs ont rêvée.",
      coverImage:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=80",
      author: "Fatou Diallo",
      publishedAt: "2026-02-04",
      tags: ["Événementiel", "Régie", "Production"],
    },
    {
      slug: "tour-horizon-livraison",
      title: "Tour Horizon : retour sur la livraison d'un projet emblématique",
      excerpt:
        "Coulisses de 32 mois de chantier pour livrer un R+18 HQE au cœur du Plateau.",
      content:
        "La Tour Horizon symbolise l'ambition urbaine de notre groupe. Ce projet illustre notre capacité à conjuguer densité, performance énergétique et signature architecturale forte. Récit d'un chantier hors normes.",
      coverImage:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
      author: "Mohamed Traoré",
      publishedAt: "2025-10-21",
      tags: ["Construction", "Projet", "Tour"],
    },
  ]);

  await db.insert(partners).values([
    {
      name: "Ministère des Infrastructures",
      logo: "https://placehold.co/300x120/0a1f3d/ffffff?text=Min.+Infrastructures",
      website: "https://example.gouv.ci",
    },
    {
      name: "AGEROUTE",
      logo: "https://placehold.co/300x120/0a1f3d/ffffff?text=AGEROUTE",
      website: "https://example.com",
    },
    {
      name: "Banque Atlantique",
      logo: "https://placehold.co/300x120/0a1f3d/ffffff?text=Banque+Atlantique",
      website: "https://example.com",
    },
    {
      name: "Sofitel",
      logo: "https://placehold.co/300x120/0a1f3d/ffffff?text=Sofitel",
      website: "https://example.com",
    },
    {
      name: "Africell",
      logo: "https://placehold.co/300x120/0a1f3d/ffffff?text=Africell",
      website: "https://example.com",
    },
    {
      name: "Plateau Real Estate",
      logo: "https://placehold.co/300x120/0a1f3d/ffffff?text=Plateau+RE",
      website: "https://example.com",
    },
  ]);

  await db.insert(testimonials).values([
    {
      name: "Stéphane Adjé",
      role: "Directeur Général",
      company: "Plateau Real Estate Holding",
      quote:
        "BuildVision a livré la Tour Horizon dans les délais, en respectant un cahier des charges architectural exigeant. Une rigueur exceptionnelle.",
      rating: 5,
    },
    {
      name: "Mariam Soro",
      role: "Directrice Événementiel",
      company: "Fondation African Tech",
      quote:
        "JR Service a transformé notre sommet en une expérience mémorable pour 1 800 participants. Production impeccable de A à Z.",
      rating: 5,
    },
    {
      name: "Patrick K.",
      role: "Particulier",
      company: "Mariage Bingerville",
      quote:
        "Trois jours d'événement parfaits. L'équipe a anticipé chaque détail, nos invités en parlent encore.",
      rating: 5,
    },
  ]);

  console.log("Seed completed successfully.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
