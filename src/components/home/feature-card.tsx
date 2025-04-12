import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Props for the FeatureCard component
 */
export type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionElement: React.ReactNode;
  iconBgClass: string;
  iconTextClass: string;
};

/**
 * Card component for displaying features with icon, title, description and action
 */
export const FeatureCard = ({
  icon,
  title,
  description,
  actionElement,
  iconBgClass,
  iconTextClass,
}: FeatureCardProps) => (
  <Card className="border-none shadow-md">
    <CardHeader className="pb-2">
      <div
        className={`w-12 h-12 ${iconBgClass} rounded-full flex items-center justify-center ${iconTextClass} mb-4`}
      >
        {icon}
      </div>
      <CardTitle className="text-xl">{title}</CardTitle>
    </CardHeader>
    <CardContent className="pb-4">
      <CardDescription className="text-gray-600">{description}</CardDescription>
    </CardContent>
    <CardFooter>{actionElement}</CardFooter>
  </Card>
);
