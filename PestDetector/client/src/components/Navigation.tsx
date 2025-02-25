import { Link, useLocation } from "wouter";
import { Home, Camera, List, Store, Map } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/scan", icon: Camera, label: "Scan" },
    { href: "/results", icon: List, label: "Results" },
    { href: "/farm", icon: Map, label: "Farm" },
    { href: "/agrovets", icon: Store, label: "Agrovets" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <div className="container mx-auto px-4">
        <div className="flex justify-around py-2">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}>
              <a className={`flex flex-col items-center p-2 ${location === href ? 'text-primary' : 'text-muted-foreground'}`}>
                <Icon className="h-6 w-6" />
                <span className="text-xs mt-1">{label}</span>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}