import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Store } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-6 pb-16">
      <h1 className="text-4xl font-bold text-center mb-8">
        Plant Disease Detection
      </h1>

      <Card>
        <CardContent className="p-6 space-y-4">
          <p className="text-center text-muted-foreground">
            Take a photo of your plant to identify pests and diseases
          </p>

          <div className="flex flex-col gap-4">
            <Link href="/scan">
              <Button className="w-full" size="lg">
                <Camera className="mr-2 h-5 w-5" />
                Scan Plant
              </Button>
            </Link>

            <Link href="/agrovets">
              <Button variant="outline" className="w-full" size="lg">
                <Store className="mr-2 h-5 w-5" />
                Find Agrovets
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
