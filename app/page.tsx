import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import HeroComponent from "../components/home/HeroComponent";
import HomeComponent from "@/components/home/HomeComponent";


export default function Page() {
  // Add any state or hooks you need here
  
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderComponent />
      <main className="flex-grow">
        <HeroComponent />
        </main>
        <HomeComponent /> 
      <FooterComponent />
    </div>
  );
}