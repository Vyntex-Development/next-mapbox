import supabase from "../src/supabase/supabase";
import UsersList from "../src/pages/UsersList";

const users = ({ users }) => {
  return <UsersList users={users} />;
};

export default users;

export async function getStaticProps() {
  let { data: users } = await supabase.from("users").select("*");
  return {
    props: {
      users,
    },
  };
}
