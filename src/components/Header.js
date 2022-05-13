import Logo from "../assets/images/Logo";
import classes from "./Header.module.css";
import FacebookIcon from "../assets/images/FacebookIcon";
import LinkedinIcon from "../assets/images/LinkedinIcon";
import TwitterIcon from "../assets/images/TwitterIcon";
import RedditIcon from "../assets/images/RedditIcon";
import Link from "./UI/Link";

const Header = () => {
  return (
    <header className={classes.header}>
      <div className="container">
        <div className={classes.iconsContainer}>
          <span>SHARE:</span>
          <div className={classes.icons}>
            <TwitterIcon />
            <FacebookIcon />
            <LinkedinIcon />
            <RedditIcon />
          </div>
        </div>
        <div>
          <Logo />
        </div>
        <div className={classes.linksContainer}>
          <Link href="/login" type="transparent">
            LOGIN
          </Link>
          <Link href="/signup" type="blue">
            SIGN UP
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
