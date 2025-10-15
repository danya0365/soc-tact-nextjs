import RulesView from "@/src/presentation/components/fantasy/RulesView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rules & Help | Fantasy Football",
  description: "เรียนรู้กฎและวิธีเล่น Fantasy Football - ระบบการให้คะแนน และ FAQ",
  keywords: "fantasy rules, fpl rules, scoring system, กฎ fantasy, วิธีเล่น",
};

export default function RulesPage() {
  return <RulesView />;
}
