import { useState, useRef } from "react";
import { useLocation } from "wouter";
import CameraComponent from "@/components/Camera";
import { Card } from "@/components/ui/card";
import { detectPest } from "@/lib/model";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function Scan() {
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const drawDetections = (img: HTMLImageElement, results: any[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the image
    ctx.drawImage(img, 0, 0);

    // Draw bounding boxes
    results.forEach(result => {
      const { boundingBox } = result;
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        boundingBox.x1,
        boundingBox.y1,
        boundingBox.x2 - boundingBox.x1,
        boundingBox.y2 - boundingBox.y1
      );

      // Draw label
      ctx.fillStyle = '#00ff00';
      ctx.font = '16px Arial';
      ctx.fillText(
        `${result.name} (${result.confidence}%)`,
        boundingBox.x1,
        boundingBox.y1 - 5
      );
    });
  };

  const handleCapture = async (imageSrc: string) => {
    try {
      setIsProcessing(true);

      // Create an image element from the captured photo
      const img = new Image();
      img.src = imageSrc;
      await img.decode();

      // Run detection
      const results = await detectPest(img);

      // Draw detections on canvas
      drawDetections(img, results);

      // Store results in sessionStorage
      sessionStorage.setItem('scanResults', JSON.stringify(results));

      // Show success message
      toast({
        title: "Analysis Complete",
        description: "Redirecting to results...",
      });

      // Navigate to results page
      setLocation('/results');
    } catch (error) {
      console.error('Detection failed:', error);
      toast({
        variant: "destructive",
        title: "Detection Failed",
        description: "Please try again or use a different image",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <h1 className="text-2xl font-bold">Scan Plant</h1>

      <Card className="relative">
        <CameraComponent onCapture={handleCapture} />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 pointer-events-none"
        />
        {isProcessing && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p>Analyzing image...</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}