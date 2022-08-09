import classes from "./FavoritesList.module.css";
import Link from "../components/UI/Link";

const FavoritesList = ({ allFavorites, user }) => {
  return (
    <>
      <div className={`${classes.FavoritesListWrapper}`}>
        <ul className={`${classes.FavoritesList} container`}>
          <h3>List of my favorites</h3>
          {allFavorites.map((favorite, i) => {
            return (
              <Link key={i} type="blue" href={`/${favorite.url}`}>
                <li>{favorite.place}</li>
              </Link>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default FavoritesList;
