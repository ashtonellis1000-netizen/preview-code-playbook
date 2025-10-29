import { BuildCard } from "@/components/BuildCard";
import { TopBar } from "@/components/TopBar";
import { BottomNavigation } from "@/components/BottomNavigation";

const mockBuilds = [
  {
    id: "1",
    shopName: "Apex Performance",
    shopVerified: true,
    carModel: "2023 BMW M4 Competition",
    buildTitle: "Stage 3 Turbo Build",
    stages: [
      {
        id: "before",
        title: "Stock",
        image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=2000",
        description: "Factory 503hp, looking to push boundaries",
      },
      {
        id: "during",
        title: "Installation",
        image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000",
        description: "Pure turbos, upgraded intercooler, tuned ECU",
      },
      {
        id: "after",
        title: "Complete",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000",
        description: "700hp monster - dyno verified ✓",
      },
    ],
    stats: {
      horsepower: 700,
      torque: 650,
      zeroToSixty: 2.8,
      quarterMile: 10.2,
    },
    likes: 1247,
    comments: 89,
    isLiked: false,
    isSaved: false,
  },
  {
    id: "2",
    shopName: "Carbon Customs",
    shopVerified: true,
    carModel: "2024 Porsche 911 GT3 RS",
    buildTitle: "Full Carbon Aero Kit",
    stages: [
      {
        id: "before",
        title: "Stock",
        image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2000",
        description: "Already beautiful, but we can do better",
      },
      {
        id: "during",
        title: "Fabrication",
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000",
        description: "Custom carbon fiber splitter, diffuser, wing",
      },
      {
        id: "after",
        title: "Complete",
        image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=2000",
        description: "Race-ready aerodynamics, track-tested",
      },
    ],
    stats: {
      horsepower: 525,
      torque: 465,
      zeroToSixty: 3.0,
      quarterMile: 10.9,
    },
    likes: 2103,
    comments: 156,
    isLiked: true,
    isSaved: false,
  },
  {
    id: "3",
    shopName: "Velocity Wraps",
    shopVerified: false,
    carModel: "2022 Tesla Model S Plaid",
    buildTitle: "Satin Black Transformation",
    stages: [
      {
        id: "before",
        title: "Stock",
        image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2000",
        description: "Pearl white, ready for total transformation",
      },
      {
        id: "during",
        title: "Wrapping",
        image: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?q=80&w=2000",
        description: "Premium 3M satin black wrap installation",
      },
      {
        id: "after",
        title: "Complete",
        image: "https://images.unsplash.com/photo-1536700503339-1e4b06520771?q=80&w=2000",
        description: "Stealthy electric beast",
      },
    ],
    stats: {
      horsepower: 1020,
      torque: 1050,
      zeroToSixty: 1.99,
      quarterMile: 9.23,
    },
    likes: 892,
    comments: 67,
    isLiked: false,
    isSaved: true,
  },
];

const Index = () => {
  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-background">
      <TopBar />
      {mockBuilds.map((build) => (
        <BuildCard key={build.id} {...build} />
      ))}
      <BottomNavigation />
    </div>
  );
};

export default Index;
