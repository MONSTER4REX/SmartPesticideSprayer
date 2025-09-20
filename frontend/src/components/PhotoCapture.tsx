'use client';

import { useState, useRef } from 'react';

export default function PhotoCapture() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        
        // Stop camera
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        setIsCapturing(false);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
        setUploadMessage(''); // Clear previous messages
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setUploadMessage("Please choose or capture a photo first!");
      return;
    }

    setIsUploading(true);
    setUploadMessage('');

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        setUploadMessage(`✅ ${data.message} File: ${data.fileName} (${(data.fileSize / 1024).toFixed(1)}KB)`);
        
        // Show analysis status
        setTimeout(() => {
          setUploadMessage(prev => prev + ` Analysis: ${data.analysis.status} (${data.analysis.estimatedTime})`);
        }, 1000);
      } else {
        const errorData = await response.json();
        setUploadMessage(`❌ ${errorData.error || "Upload failed! Please try again."}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadMessage("❌ Upload failed! Please check your connection.");
    } finally {
      setIsUploading(false);
    }
  };

  const analyzeImage = () => {
    if (capturedImage) {
      // Simulate image analysis
      alert('Image analysis started! This would typically send the image to an AI service for crop health analysis.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Capture or Upload Plant Image
        </h3>
        <p className="text-gray-600">
          Take a photo using your camera or upload an existing image for health analysis
        </p>
      </div>

      {/* Camera Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">📷 Camera Capture</h4>
        <div className="space-y-4">
          {!isCapturing ? (
            <button
              onClick={startCamera}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Start Camera
            </button>
          ) : (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={capturePhoto}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Capture Photo
                </button>
                <button
                  onClick={() => {
                    const stream = videoRef.current?.srcObject as MediaStream;
                    if (stream) {
                      stream.getTracks().forEach(track => track.stop());
                    }
                    setIsCapturing(false);
                  }}
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Stop Camera
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced File Upload Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">📁 Upload or Capture Photo</h4>
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            📸 Choose or Capture Photo
          </button>
          
          {/* Upload Button */}
          <button
            onClick={uploadPhoto}
            disabled={isUploading || !fileInputRef.current?.files?.[0]}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
              isUploading || !fileInputRef.current?.files?.[0]
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isUploading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Uploading...
              </div>
            ) : (
              '📤 Upload Photo'
            )}
          </button>
          
          {/* Upload Message */}
          {uploadMessage && (
            <div className={`p-3 rounded-lg text-center text-sm ${
              uploadMessage.includes('✅') || uploadMessage.includes('successfully')
                ? 'bg-green-100 text-green-800'
                : uploadMessage.includes('❌') || uploadMessage.includes('failed')
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {uploadMessage}
            </div>
          )}
        </div>
      </div>

      {/* Captured Image Display */}
      {capturedImage && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">📸 Captured Image</h4>
          <div className="space-y-4">
            <div className="relative">
              <img
                src={capturedImage}
                alt="Captured plant"
                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={analyzeImage}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Analyze Image
              </button>
              <button
                onClick={() => setCapturedImage(null)}
                className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Clear Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results Placeholder */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h4 className="text-md font-semibold text-blue-900 mb-2">🔬 Analysis Features</h4>
        <ul className="text-blue-800 space-y-1">
          <li>• Disease detection and classification</li>
          <li>• Pest identification</li>
          <li>• Nutrient deficiency analysis</li>
          <li>• Growth stage assessment</li>
          <li>• Health score calculation</li>
        </ul>
      </div>
    </div>
  );
}
