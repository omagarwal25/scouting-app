import Button from "./Button";

const ButtonStack = () => {
  return (
    <div className="flex w-full flex-col items-center justify-between gap-5">
      <Button label="Delete Last Entry" color="Red" />
      <Button label="Next Game" color="Blue" />
    </div>
  );
};

export default ButtonStack;
