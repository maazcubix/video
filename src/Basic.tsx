import {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import React, { useEffect, useRef, useState } from "react";

import "./App.css";
import VirtualBackgroundExtension from "agora-extension-virtual-background";
import AgoraRTC from "agora-rtc-sdk-ng";
import { VideoExtension } from "deepar-agora-extension";

export const Basics = () => {
  const videoContainerRef = useRef(null);

  const [calling, setCalling] = useState(false);
  const isConnected = useIsConnected();
  const [appId, setAppId] = useState("c271e6e573664bf2ac2bbaef3ebb7ed4");
  const [channel, setChannel] = useState("testcubix");
  const [token, setToken] = useState("");

  useJoin(
    { appid: appId, channel: channel, token: token ? token : null },
    calling
  );
  //local user
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  usePublish([localMicrophoneTrack, localCameraTrack]);
  //remote users
  const remoteUsers = useRemoteUsers();

  console.log(`localCameraTrack`, localCameraTrack);

  const initializeVirtualBackgroundProcessor = async () => {
    const extension = new VirtualBackgroundExtension();
    if (!extension.checkCompatibility()) {
      // The current browser does not support the virtual background plugin, you can stop executing the subsequent logic
      console.error("Does not support Virtual Background!");
    }
    AgoraRTC.registerExtensions([extension]);
    const processor = extension.createProcessor();
    await processor.init();
    localCameraTrack!
      .pipe(processor)
      .pipe(localCameraTrack!.processorDestination);
    processor.setOptions({ type: "blur", blurDegree: 3 });

    await processor.enable();
  };
  useEffect(() => {
    // Request camera permissions when the component mounts
    const requestCameraPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch (err) {
        console.error("Error requesting camera permissions:", err);
      }
    };
    requestCameraPermission();
  }, []);
  useEffect(() => {
    if (localCameraTrack) {
      initializeVirtualBackgroundProcessor();
    }
  }, [localCameraTrack]);

  return (
    <>
      <div className="room">
        {isConnected ? (
          <div className="user-list">
            <div className="user">
              <LocalUser
                audioTrack={localMicrophoneTrack}
                cameraOn={cameraOn}
                micOn={micOn}
                videoTrack={localCameraTrack}
                cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg"
              >
                <samp className="user-name">You</samp>
              </LocalUser>
            </div>
            {remoteUsers.map((user) => (
              <div className="user" key={user.uid}>
                <RemoteUser
                  cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg"
                  user={user}
                >
                  <samp className="user-name">{user.uid}</samp>
                </RemoteUser>
              </div>
            ))}
          </div>
        ) : (
          <div className="join-room">
            {/* <img alt="agora-logo" className="logo" src={logo} /> */}
            <input
              onChange={(e) => setAppId(e.target.value)}
              placeholder="<Your app ID>"
              value={appId}
            />
            <input
              onChange={(e) => setChannel(e.target.value)}
              placeholder="<Your channel Name>"
              value={channel}
            />
            <input
              onChange={(e) => setToken(e.target.value)}
              placeholder="<Your token>"
              value={token}
            />

            <button
              className={`join-channel ${!appId || !channel ? "disabled" : ""}`}
              disabled={!appId || !channel}
              onClick={() => setCalling(true)}
            >
              <span>Join Channel</span>
            </button>
          </div>
        )}
      </div>
      {isConnected && (
        <div className="control">
          <div className="left-control">
            <button className="btn" onClick={() => setMic((a) => !a)}>
              <i className={`i-microphone ${!micOn ? "off" : ""}`} />
            </button>
            <button className="btn" onClick={() => setCamera((a) => !a)}>
              <i className={`i-camera ${!cameraOn ? "off" : ""}`} />
            </button>
          </div>
          <button
            className={`btn btn-phone ${calling ? "btn-phone-active" : ""}`}
            onClick={() => setCalling((a) => !a)}
          >
            {calling ? (
              <i className="i-phone-hangup" />
            ) : (
              <i className="i-mdi-phone" />
            )}
          </button>
        </div>
      )}
      Q
    </>
  );
};

export default Basics;
