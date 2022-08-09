import supabase from "../src/supabase/supabase";
import UsersList from "../src/pages/UsersList";
import SEO from "../src/components/SEO/SEO";

const users = ({ users }) => {
  return (
    <>
      <SEO title="Users" />
      <UsersList users={users} />
    </>
  );
};

export default users;

export async function getStaticProps() {
  let { data: users } = await supabase.from("users").select("*");
  return {
    props: {
      users,
    },
    revalidate: 10,
  };
}
