import React, { useEffect, useRef } from "react";
import { VideoExtension } from "deepar-agora-extension";
import AgoraRTC from "agora-rtc-sdk-ng";

const AgoraDeepAR = () => {
  const videoContainerRef = useRef(null);

  useEffect(() => {
    const initAgoraDeepAR = async () => {
      // Initialize DeepAR extension
      const videoExtension = new VideoExtension({
        licenseKey:
          "05db19ab8ce6a6adbfcdf9450e29a5a56602ac03e64b40a1b874638c1921f91e3241d58adf26e67c", // create the license key here https://developer.deepar.ai/projects
        onInitialize: (deepAR) => {
          // At this point DeepAR is initialized and can be used normally
          console.log("DeepAR initialized", deepAR);
        },
        effect: "https://cdn.jsdelivr.net/npm/deepar/effects/aviators",
      });

      // Register extension with AgoraRTC
      AgoraRTC.registerExtensions([videoExtension]);

      // Create DeepAR extension processor
      const processor = videoExtension.createProcessor();

      // Create CameraVideoTrack
      const videoTrack = await AgoraRTC.createCameraVideoTrack();

      // Piping processor
      videoTrack.pipe(processor).pipe(videoTrack.processorDestination);

      // Play video in container
      await videoTrack.play(videoContainerRef.current, { mirror: false });
    };

    initAgoraDeepAR();

    return () => {
      // Clean up resources on component unmount
      if (videoContainerRef.current) {
        videoContainerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
      className="video-container"
      ref={videoContainerRef}
      style={{ width: "640px", height: "640px" }}
    ></div>
  );
};

export default AgoraDeepAR;
// useEffect(() => {
//   // Request camera permissions when the component mounts
//   const requestCameraPermission = async () => {
//     try {
//       await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     } catch (err) {
//       console.error("Error requesting camera permissions:", err);
//     }
//   };
//   requestCameraPermission();
// }, []);
