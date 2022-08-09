import supabase from "../../src/supabase/supabase";
import SEO from "../../src/components/SEO/SEO";
import { useContext } from "react";
import FavoritesContext from "../../context-store/favorites-context";
import FavoritesList from "../../src/pages/FavoritesList";
const User = ({ user }) => {
  const { allFavorites } = useContext(FavoritesContext);
  return (
    <>
      <SEO title="Favorites" />
      <FavoritesList allFavorites={allFavorites} user={user} />
    </>
  );
};

export async function getStaticProps(context) {
  console.log(context);
  let { data: users } = await supabase.from("users").select("*");
  let user = users.find(
    (user) => user.id.toString() === context.params.userId.toString()
  );
  return {
    props: {
      user,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  let { data: users } = await supabase.from("users").select("*");
  const paths = users.map((user) => {
    return {
      params: {
        userId: user.id.toString(),
      },
    };
  });
  return {
    paths: paths,
    fallback: false, // false or 'blocking'
  };
}

export default User;
