// import { Fragment, useContext } from "react";
import Form from "../components/Form";
import { joinNowConfig } from "../config/formConfig";
// import { joinNowConfig } from "../../utils/formConfig";
// import { useEffect } from "react";
// import Button from "../UI/Button/Button";
// import useHTTP from "../hooks/use-http";
// import UIMessage from "../UI/UIMessage/UIMessage";
// import AuthContext from "../../context-store/auth-context";
import classes from "./LoginPage.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import Button from "../components/UI/Button";

const Login = () => {
  //   const { httpClient, uiData, responseData } = useHTTP();
  //   const authCtx = useContext(AuthContext);
  const router = useRouter();

  //   useEffect(() => {
  //     if (responseData) {
  //     //   authCtx.login(JSON.stringify(responseData));
  //       const toId = setTimeout(() => {
  //         router.replace("/dashboard");
  //       }, 2000);
  //       return () => {
  //         clearInterval(toId);
  //       };
  //     }
  //   }, [responseData]);

  const onSubmitHandler = (formData) => {
    let userDetails = {
      user_name: formData.user_name,
      password: formData.password,
    };
    console.log(userDetails);
    // httpClient.sendRequest("POST", "/token/", null, userDetails);
  };

  return (
    <div className={classes.loginPageWrapper}>
      <h1>Wellcome back!</h1>
      <Form
        formConfig={joinNowConfig.filter(
          (config) => config.inputConfig.name !== "email"
        )}
        onSubmit={onSubmitHandler}
        // onLoading={uiData.loading}
      >
        <Button type="blue">Login</Button>
        {/* <UIMessage uiData={uiData} /> */}
      </Form>
      <p>
        Dont have an account? Please <Link href="/signup">register.</Link>
      </p>
    </div>
  );
};

export default Login;
