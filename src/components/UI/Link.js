import Link from "next/link";
import classes from "./Link.module.css";

const LinkButton = ({ href, type, children }) => {
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

  return (
    <div className={className}>
      <Link href={href}>{children}</Link>
    </div>
  );
};

export default LinkButton;
