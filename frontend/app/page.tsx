'use client';



import Image from "next/image";
import Header, { TabType } from "./components/Header";
import MedicalImageAnalysis from "./components/MedicalImageAnalysis";
export default function Home() {
  return (
    <>
     <Header activeTab={"image"} setActiveTab={function (tab: TabType): void {
        throw new Error("Function not implemented.");
      } } />
     <MedicalImageAnalysis />
</>
  );
}