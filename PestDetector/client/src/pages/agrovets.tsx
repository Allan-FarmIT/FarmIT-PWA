import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Navigation } from "lucide-react";
import type { Agrovet } from "@shared/schema";

// Using a free token for demonstration - in production use environment variables
mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJja2V5IiwianRpIjoiZGVtbyJ9.demo';

export default function Agrovets() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { data: agrovets, isLoading } = useQuery<Agrovet[]>({
    queryKey: ['/api/agrovets']
  });

  useEffect(() => {
    if (mapContainer.current && !map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [36.8219, -1.2921], // Default to Nairobi
        zoom: 12
      });

      map.current.addControl(new mapboxgl.NavigationControl());
    }

    // Add markers for each agrovet
    if (map.current && agrovets) {
      agrovets.forEach((agrovet) => {
        const marker = new mapboxgl.Marker()
          .setLngLat([Number(agrovet.longitude), Number(agrovet.latitude)])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <h3 class="font-bold">${agrovet.name}</h3>
            <p>${agrovet.location}</p>
          `))
          .addTo(map.current!);
      });
    }
  }, [agrovets]);

  return (
    <div className="space-y-6 pb-16">
      <h1 className="text-2xl font-bold">Nearby Agrovets</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Map Container */}
        <div className="md:col-span-2 h-[500px] rounded-lg overflow-hidden">
          <div ref={mapContainer} className="w-full h-full" />
        </div>

        {/* Agrovet List */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {agrovets?.map((agrovet) => (
            <Card key={agrovet.id} className="relative">
              <CardHeader>
                <h3 className="text-lg font-semibold">{agrovet.name}</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {agrovet.location}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  {agrovet.contact}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => {
                    map.current?.flyTo({
                      center: [Number(agrovet.longitude), Number(agrovet.latitude)],
                      zoom: 15
                    });
                  }}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  View on Map
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}