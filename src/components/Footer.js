import classes from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <div className="container">
        <div className={classes.rights}>
          <p>© ALL RIGHTS RESERVED. DELOCAL.XYZ</p>
        </div>
        <div className={classes.links}>
          <a href="">Terms & Conditions</a>
          <a href="">Privacy Policy</a>
          <a href="">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
