import VirtualBackgroundExtension, {
  IVirtualBackgroundProcessor,
} from "agora-extension-virtual-background";
import AgoraRTC from "agora-rtc-sdk-ng";
import { TracksContext } from "agora-react-uikit";
import { useContext, useEffect, useState, useRef } from "react";

const VirtualBackground = () => {
  const [extensionActive, setExtensionActive] = useState(false);
  const { localVideoTrack } = useContext(TracksContext);
  const ext = useRef(new VirtualBackgroundExtension());
  const processor = useRef<IVirtualBackgroundProcessor>();
  useEffect(() => {
    const initExtension = async () => {
      AgoraRTC.registerExtensions([ext.current]);
      processor.current = ext.current.createProcessor();
      await processor.current.init("<Path to WASM module>");
      if (processor.current && localVideoTrack) {
        localVideoTrack
          .pipe(processor.current)
          .pipe(localVideoTrack.processorDestination);
        processor.current.setOptions({ type: "blur", blurDegree: 3 });
        await processor.current.enable();
        setExtensionActive(true);
      }
    };
    initExtension();
  }, []);
//   const enableBackground = async () => {
//     if (processor.current && localVideoTrack) {
//       localVideoTrack
//         .pipe(processor.current)
//         .pipe(localVideoTrack.processorDestination);
//       processor.current.setOptions({ type: "blur", blurDegree: 3 });
//       await processor.current.enable();
//       setExtensionActive(true);
//     }
//   };

//   const disableBackground = async () => {
//     if (processor.current && localVideoTrack) {
//       localVideoTrack.unpipe();
//       await processor.current.disable();
//       setExtensionActive(false);
//     }
//   };
  return <></>;
};

const btn = {
  backgroundColor: "#007bff",
  cursor: "pointer",
  borderRadius: 5,
  padding: 5,
  color: "#ffffff",
  fontSize: 16,
  margin: "auto",
  paddingLeft: 50,
  paddingRight: 50,
  marginBottom: 20,
  marginTop: 10,
};

export default VirtualBackground;
