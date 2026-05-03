import { Star } from "lucide-react";

interface ReputationBadgeProps {
  points: number;
  size?: "sm" | "md" | "lg";
}

const ReputationBadge = ({ points, size = "md" }: ReputationBadgeProps) => {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-3 py-1 gap-1.5",
    lg: "text-base px-4 py-1.5 gap-2",
  };

  const iconSize = { sm: 10, md: 14, lg: 16 };

  return (
    <div className={`inline-flex items-center rounded-full glass border-gold/30 gold-glow font-semibold text-gold ${sizeClasses[size]}`}>
      <Star size={iconSize[size]} className="fill-current" />
      <span>{points}</span>
    </div>
  );
};

export default ReputationBadge;
