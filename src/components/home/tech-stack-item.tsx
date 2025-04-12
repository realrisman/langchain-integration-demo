import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

/**
 * Props for the TechStackItem component
 */
export type TechStackItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  badges: { text: string; colorClass: string }[];
};

/**
 * Component for displaying technology stack items with hover card details
 */
export const TechStackItem = ({
  icon,
  title,
  description,
  badges,
}: TechStackItemProps) => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <div className="text-center p-6 cursor-pointer transition-all hover:bg-gray-50 rounded-lg">
        <div
          className={`w-16 h-16 bg-${title.toLowerCase()}-50 rounded-full flex items-center justify-center text-${title.toLowerCase()}-600 mx-auto mb-4`}
        >
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </HoverCardTrigger>
    <HoverCardContent className="w-80">
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">{title}</h4>
        <p className="text-sm">
          {description}{" "}
          {title === "LangChain"
            ? "designed to leverage the capabilities of LLMs through composable components."
            : title === "LangSmith"
              ? "providing enhanced observability and insights."
              : "enabling complex AI workflows and agent interactions through graph structures."}
        </p>
        <div className="flex items-center pt-2 flex-wrap gap-2">
          {badges.map((badge, index) => (
            <Badge key={index} className={badge.colorClass}>
              {badge.text}
            </Badge>
          ))}
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
);
