import React, { useEffect, useRef } from "react";
import { Webcam, Player, Dom, BanubaSDK } from "@banuba/webar";

const BanubaPlayer = () => {
  const playerContainerRef = useRef(null);

  useEffect(() => {
    let playerInstance;

    const initializePlayer = async () => {
      playerInstance = await Player.create({
        clientToken:
          "Qk5CIGOlVFx2x/KaYKJskMP7HJMfA30BozKjw12t6LTGSTApGkkS6zPLkC9Ht53BnqHK2VmWoKnME4Ud8QRZ0smQxxhyt/OpKRiP3FVF3dY87djPzhSUbh8VB0OXfpKXs6BhmkeNrRjJxUNIedps0L/EYW4V35MXpOTYDVysoZvAZaX7IDilzRNmrwODBJAKw7GBs6mNO0dO+Gw6++9zjP2XcaHgCwlSs3vUJjzrUc6ZyHoWeK7HRFofQzvPPITy9UpekoCt7kcS9qAz1Dc4X3Q+sMj3SrgykIObvZx+grXdsEwDQdJzqDO04aYEFAH+NFKjnVZq02I54M1H6C/Wwp4UHWWbpkgS6GJVlAX0qP1Cyy27ilLtFsLdd4o7esHPYh/oV9ZBYkhCa9IHEmpt6w9XYpfsBbQ+kC57rjiyxxuZZ/OsPuaiuMVQ0j7RrhA2UvuCcmtfpkDMFaDRRirzZ6H7Vm+j9Swl7+HPTDblazrV8SOtKRuUGe3KVEuweYn5oefKyoPwBnpNmYHSQ1iRzFWBF4yXORwarIjajHHCwhkndz9vdouQsjcZoYADG4jCAs/5Eox6PcQnX8UGuOUceQ5L+A8TuWV9JL+tclj05kylB3OgzQZHPxybNE3XpSZXtog2/mPqmdDSd3ej6rEyGg==",
          locateFile: (file) => {
            // Adjust the path according to your project structure
            return `/ban`;
          },
        });

      playerInstance.use(new Webcam());

      if (playerContainerRef.current) {
        Dom.render(playerInstance, playerContainerRef.current);
      }
    };

    initializePlayer();

    return () => {
      // Clean up the player instance on component unmount
      if (playerInstance) {
        playerInstance.destroy();
      }
    };
  }, []);

  return (
    <div ref={playerContainerRef} style={{ width: "900px", height: "200px" }} />
  );
};

export default BanubaPlayer;
