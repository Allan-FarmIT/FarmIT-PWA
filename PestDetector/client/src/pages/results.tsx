import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Beaker } from "lucide-react";
import type { Pest, Severity } from "@shared/schema";

function getSeverityColor(severity: Severity) {
  switch (severity) {
    case 'low':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function Results() {
  const { data: pests } = useQuery<Pest[]>({ 
    queryKey: ['/api/pests']
  });

  const results = JSON.parse(sessionStorage.getItem('scanResults') || '[]');

  if (!results.length) {
    return (
      <Alert>
        <AlertDescription>
          No scan results available. Please scan a plant first.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <h1 className="text-2xl font-bold">Detection Results</h1>

      <div className="space-y-4">
        {results.map((result: any, index: number) => {
          const pestDetails = pests?.find(p => p.name === result.name);

          return (
            <Card key={index}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{result.name}</h3>
                  <div className="flex gap-2">
                    <Badge variant="outline">{result.confidence}% Match</Badge>
                    <Badge className={getSeverityColor(result.severity)}>
                      {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)} Severity
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-muted-foreground">{result.description}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Recommended Treatments:</h4>
                  <Tabs defaultValue="organic" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="organic" className="flex items-center gap-2">
                        <Leaf className="h-4 w-4" />
                        Organic
                      </TabsTrigger>
                      <TabsTrigger value="chemical" className="flex items-center gap-2">
                        <Beaker className="h-4 w-4" />
                        Chemical
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="organic" className="mt-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-muted-foreground">
                          {pestDetails?.treatments[result.severity]?.organic}
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="chemical" className="mt-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-muted-foreground">
                          {pestDetails?.treatments[result.severity]?.chemical}
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Treatment Guidelines:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Always follow the recommended dosage</li>
                    <li>Use appropriate protective equipment</li>
                    <li>Consider environmental factors before treatment</li>
                    <li>Monitor progress after application</li>
                    <li>For chemical treatments, follow safety precautions strictly</li>
                    <li>Consider integrated pest management approaches</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}