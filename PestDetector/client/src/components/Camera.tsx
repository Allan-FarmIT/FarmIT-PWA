import { useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { CameraIcon, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CameraProps {
  onCapture: (imageSrc: string) => void;
}

export default function CameraComponent({ onCapture }: CameraProps) {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
  }, [onCapture]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onCapture(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full rounded-lg"
          videoConstraints={{
            facingMode: "environment"
          }}
        />
        <Button 
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          size="lg"
          onClick={capture}
        >
          <CameraIcon className="mr-2 h-5 w-5" />
          Capture
        </Button>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        <Button 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-2 h-5 w-5" />
          Upload Picture
        </Button>
      </div>
    </div>
  );
}