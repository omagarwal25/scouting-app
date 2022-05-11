import ButtonStack from "./ButtonStack";
import { QRScan } from "./QRScan";

const ScannerDash = () => {
  // create a 4 col 3 row grid, make the QRScan take first two cols and all rows
  return (
    <div className="grid grid-cols-6 grid-rows-2 gap-4">
      <div className="col-span-2 row-span-2">
        <QRScan />
      </div>
      <div className="col-span-2 row-span-2 flex">
        <ButtonStack />
      </div>
      <div className="col-span-2 row-span-1 flex flex-col font-code text-xl text-black">
        <span className="w-full">Scout ID: Blue 1</span>
        <span className="w-full">Scout Name: Om Agarwal</span>
        <span className="w-full">Match Type: Practice</span>
        <span className="w-full">Match Number: 20</span>
        <span className="w-full">Team Number: 1884</span>
      </div>

      <div className="col-span-1 row-span-1 flex flex-col font-code text-xl text-black">
        <h1 className="font-bold">Current Match</h1>
        <p>Practice 5</p>
      </div>
      <div className="flex flex-col text-right font-code text-xl">
        <p className="font-bold text-griffins-blue">Blue 1</p>
        <p className="">Blue 2</p>
        <p className="">Blue 3</p>
        <p className="">Red 1</p>
        <p className="font-bold text-pheonix-red">Red 2</p>
        <p className="">Red 3</p>
      </div>
    </div>
  );
};

export default ScannerDash;
