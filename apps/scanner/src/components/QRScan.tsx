import { QrReader } from "react-qr-reader";
import type { OnResultFunction } from "react-qr-reader";
import {
  autoKeys,
  decode,
  decodeGame,
  encode,
  gameDefault,
  postgameKeys,
} from "scouting-app-game";
import { addGame } from "../store";
import { useState } from "react";

export const QRScan = () => {
  const [disabled, setDisabled] = useState(false);

  const handleResult: OnResultFunction = (result, error) => {
    if (!!result && !disabled) {
      try {
        const text = result.getText();
        setDisabled(true);
        const game = decodeGame(text);

        // create a timeout of 1 second to allow the QRScan to be disabled
        setTimeout(() => {
          setDisabled(false);
        }, 1000);
        addGame(game);
      } catch (e) {
        // console.log(e);
      }
    } else if (!!error) {
      // console.log(error);
    }
  };

  return (
    <>
      <QrReader
        onResult={(result, error) => handleResult(result, error)}
        constraints={{ facingMode: "user" }}
        scanDelay={5000}
        className="aspect-5/4 w-full rounded-xl border-2 border-gray-400"
        videoStyle={{ border: "0px" }}
        videoContainerStyle={{
          border: "0px",
          height: "100%",
        }}
        ViewFinder={() => <div className="w-7/8 h-7/8 border"></div>}
      />
    </>
  );
};
