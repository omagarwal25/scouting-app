type Props = {
  label: string;
  onPress?: () => void;
  color: "Red" | "Blue";
};

const Button = (props: Props) => {
  const btnClass = `${
    props.color === "Red" ? "bg-pheonix-red" : "bg-griffins-blue"
  } p-2 rounded-xl text-4xl w-full text-white h-full border border-2 border-gray-400 drop-shadow`;

  return (
    <button className={btnClass} onClick={props.onPress}>
      {props.label}
    </button>
  );
};

export default Button;
