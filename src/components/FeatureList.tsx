import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type FeatureListProps = {
  title: string;
  features: string[];
};

export function FeatureList({ title, features }: FeatureListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="flex flex-col gap-2">
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
