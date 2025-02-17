import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "./Player.css";
import Play from "./icons/Play";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Download from "./icons/DownLoad";
import Close from "./icons/Close";
interface PlayerProps {
  record: string;
  partnership_id: string;
  callTime: string
}

export default function Player({ record, partnership_id, callTime }: PlayerProps) {
  const [isHovered, setIsHovered] = useState(false);

  const fetchMp3 = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer testtoken");

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(
      `https://api.skilla.ru/mango/getRecord?record=${record}&partnership_id=${partnership_id}&Content-type=audio/mpeg`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error("Ошибка загрузки файла");
    }

    const blob = await response.blob();
    return blob;
  };

  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const mutation: any = useMutation({
    mutationFn: fetchMp3,
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
    },
    onError: (error) => {
      console.error("Ошибка:", error);
    },
  });
  useEffect(() => {
    if (record) {
      mutation.mutate();
    }
  }, []);
  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {isHovered && callTime  ? (
        <AudioPlayer
          autoPlay
          src={downloadUrl ?? ""}
          // onPlay={() => mutation.mutate()}
          showJumpControls={false}
          layout={"horizontal"}
          hasDefaultKeyBindings={false}
          customAdditionalControls={[
            // <div onClick={() => mutation.mutate()}>
            //   <Play />
            // </div>,
            <div>
              <a href={downloadUrl ?? ""} download={downloadUrl} className="ml-4 text-blue-600">
                <Download />
              </a>
            </div>,
            <div>
              <Close />
            </div>,
          ]}
          style={{ width: "352px", height: "48px", borderRadius: "43px", justifyContent: "center", backgroundColor: "#EAF0FA" }}
        />
      ) : (
        callTime + " сек"
      )}
    </div>
  );
}
