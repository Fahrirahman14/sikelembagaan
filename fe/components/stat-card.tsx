import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary";
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden border border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_-36px_rgba(15,23,42,0.55)]",
        variant === "primary" && "border-primary/20 bg-[linear-gradient(135deg,rgba(39,81,191,0.98),rgba(26,48,107,0.98))] text-primary-foreground"
      )}
    >
      <div
        className={cn(
          "absolute right-0 top-0 h-24 w-24 rounded-full blur-3xl",
          variant === "primary" ? "bg-white/15" : "bg-primary/10",
        )}
      />
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p
              className={cn(
                "text-sm font-medium",
                variant === "primary"
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground"
              )}
            >
              {title}
            </p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
            {description && (
              <p
                className={cn(
                  "mt-1 text-sm",
                  variant === "primary"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                )}
              >
                {description}
              </p>
            )}
            {trend && (
              <p
                className={cn(
                  "mt-3 inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600",
                  variant === "primary" &&
                    (trend.isPositive ? "text-green-300" : "text-red-300")
                )}
              >
                {trend.isPositive ? "+" : "-"}
                {trend.value}% dari bulan lalu
              </p>
            )}
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg",
              variant === "primary"
                ? "bg-primary-foreground/15 text-primary-foreground shadow-black/10"
                : "bg-primary/10 text-primary shadow-primary/10"
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
