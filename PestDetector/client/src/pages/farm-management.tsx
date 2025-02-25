import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Ruler, Cloud, Sprout, Sun, CloudRain, Wind } from "lucide-react";
import type { Farm, VegetationIndices, WeatherForecast } from "@shared/schema";

// Using environment variable for production
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJja2V5IiwianRpIjoiZGVtbyJ9.demo';

export default function FarmManagement() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<any>(null);
  const [farmName, setFarmName] = useState('');
  const [activeTab, setActiveTab] = useState('satellite');
  const { toast } = useToast();

  // Mock weather data - in production, this would come from an API
  const weatherForecast: WeatherForecast[] = [
    {
      date: new Date(Date.now()).toLocaleDateString(),
      temperature: { min: 18, max: 25 },
      humidity: 65,
      rainfall: 0,
      windSpeed: 12
    },
    {
      date: new Date(Date.now() + 86400000).toLocaleDateString(),
      temperature: { min: 17, max: 24 },
      humidity: 70,
      rainfall: 2.5,
      windSpeed: 15
    },
    {
      date: new Date(Date.now() + 2 * 86400000).toLocaleDateString(),
      temperature: { min: 16, max: 23 },
      humidity: 75,
      rainfall: 5.0,
      windSpeed: 18
    },
    {
      date: new Date(Date.now() + 3 * 86400000).toLocaleDateString(),
      temperature: { min: 15, max: 22 },
      humidity: 80,
      rainfall: 8.5,
      windSpeed: 20
    },
    {
      date: new Date(Date.now() + 4 * 86400000).toLocaleDateString(),
      temperature: { min: 16, max: 23 },
      humidity: 72,
      rainfall: 3.0,
      windSpeed: 14
    }
  ];

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [36.8219, -1.2921], // Default to Nairobi
      zoom: 13
    });

    // Initialize drawing tools
    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      }
    });

    map.current.addControl(draw.current);
    map.current.addControl(new mapboxgl.NavigationControl());

    // Clean up
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const handleSaveFarm = async () => {
    const features = draw.current?.getAll();
    if (!features.features.length) {
      toast({
        variant: "destructive",
        title: "No Farm Drawn",
        description: "Please draw your farm boundaries first",
      });
      return;
    }

    if (!farmName) {
      toast({
        variant: "destructive",
        title: "Missing Farm Name",
        description: "Please enter a name for your farm",
      });
      return;
    }

    // Calculate area
    const area = turf.area(features.features[0]);

    // Save farm data
    try {
      await fetch('/api/farms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: farmName,
          boundaries: features.features[0].geometry,
          area: area,
          location: 'Kenya', // This should be determined from coordinates
        }),
      });

      toast({
        title: "Farm Saved",
        description: "Your farm has been saved successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save farm data",
      });
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <h1 className="text-2xl font-bold">Farm Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Map Container */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="h-[500px] rounded-lg overflow-hidden">
                <div ref={mapContainer} className="w-full h-full" />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Input
              placeholder="Enter farm name"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
            />
            <Button onClick={handleSaveFarm}>Save Farm</Button>
          </div>
        </div>

        {/* Analysis Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Farm Analysis</h3>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="satellite">
                    <MapPin className="h-4 w-4 mr-2" />
                    Indices
                  </TabsTrigger>
                  <TabsTrigger value="weather">
                    <Cloud className="h-4 w-4 mr-2" />
                    Weather
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="satellite" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold">NDVI</h4>
                      <p className="text-2xl">0.76</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold">MSAVI</h4>
                      <p className="text-2xl">0.82</p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold">RECI</h4>
                      <p className="text-2xl">1.23</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold">NDMI</h4>
                      <p className="text-2xl">0.45</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="weather" className="space-y-4">
                  <div className="divide-y">
                    {weatherForecast.map((day, index) => (
                      <div key={index} className="py-3 first:pt-0 last:pb-0">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{day.date}</span>
                          <div className="flex items-center gap-1">
                            <Sun className="h-4 w-4 text-yellow-500" />
                            <span>{day.temperature.min}°C - {day.temperature.max}°C</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Cloud className="h-4 w-4" />
                            <span>{day.humidity}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CloudRain className="h-4 w-4" />
                            <span>{day.rainfall}mm</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Wind className="h-4 w-4" />
                            <span>{day.windSpeed}km/h</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Recommendations</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Based on current conditions:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Soil moisture is optimal for planting</li>
                <li>Consider irrigation in the next 3 days</li>
                <li>Nitrogen levels are slightly low</li>
                <li>Good conditions for pest monitoring</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}