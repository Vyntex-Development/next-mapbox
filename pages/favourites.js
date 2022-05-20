import FavouritesPage from "../src/pages/FavouritesPage";

const Favourites = ({ favs }) => {
  return <FavouritesPage favs={favs} />;
};

export async function getServerSideProps(context) {
  const response = await fetch(
    `https://nearestdao.herokuapp.com/all/favorites?eht_address=${context.query.account}`
  );
  const data = await response.json();

  return {
    props: {
      favs: data,
    }, // will be passed to the page component as props
  };
}

export default Favourites;
