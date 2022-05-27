import Link from "next/link";
import classes from "./Link.module.css";

const LinkButton = ({ href, type, children, onClick }) => {
  let className;

  if (type === "blue") {
    className = classes.blue;
  }

  if (type === "cities-link") {
    className = classes.citiesLink;
  }

  if (type === "transparent") {
    className = classes.transparent;
  }

  if (type === "white") {
    className = classes.white;
  }

  return (
    <div className={className} onClick={onClick}>
      <Link href={href}>{children}</Link>
    </div>
  );
};

export default LinkButton;
