import classes from "./FavouritesPage.module.css";
import Link from "../components/UI/Link";

const FavouritesPage = ({ favs }) => {
  let { daos_data } = favs;
  return (
    <div className={classes.favouritesPageWrapper}>
      <ul>
        {daos_data.map((fav, index) => {
          return (
            <li key={index}>
              <Link type="blue" href={`/${fav.dao_id}`}>
                {fav.name}
              </Link>
              <span>{fav.iso2}</span>
              <span>{fav.iso3}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FavouritesPage;
