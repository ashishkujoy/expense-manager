import Webcam from "react-webcam";
import React from "react";

type WebCameraProps = {
    onCapture: (imageSrc: string) => void;
}

const WebCamera = ({ onCapture }: WebCameraProps) => {
    const webcamRef = React.useRef(null);
    const videoConstraints = {
        width: 1280,
        height: 720,
    };
    const capture = React.useCallback(
        () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const imageSrc = (webcamRef.current! as any).getScreenshot();
            if (onCapture) {
                onCapture(imageSrc);
            }
        },
        [webcamRef]
    );
    return (
        <>
            <Webcam
                audio={false}
                height={720}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={1280}
                videoConstraints={videoConstraints}
            />
            <button onClick={capture}>Capture photo</button>
        </>
    );
};

export default WebCamera;
