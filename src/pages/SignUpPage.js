// import { Fragment, useContext } from "react";
import Form from "../components/Form";
import { joinNowConfig } from "../config/formConfig";
import { getAuth } from "../utils/utils";
import axios from "axios";
// import { joinNowConfig } from "../../utils/formConfig";
// import { useEffect } from "react";
// import Button from "../UI/Button/Button";
// import useHTTP from "../hooks/use-http";
// import UIMessage from "../UI/UIMessage/UIMessage";
// import AuthContext from "../../context-store/auth-context";
import classes from "./SignUpPage.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import Button from "../components/UI/Button";

const SignUpPage = () => {
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

  const onSubmitHandler = async (formData) => {
    let userDetails = {
      username: formData.user_name,
      password: formData.password,
      email: formData.email,
    };
    // console.log(userDetails);
    // const response = await fetch("https://nearestdao.herokuapp.com/sign-up", {
    //   method: "POST",
    //   body: JSON.stringify(userDetails),
    //   credentials: "same-origin", // the fix
    //   // credentials: "include",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Accept: "application/json",
    //     // "Access-Control-Allow-Origin": "*",
    //   },
    // });
    // const headers = response;
    // console.log(headers);

    axios
      .post("https://nearestdao.herokuapp.com/sign-up", userDetails, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "https://nearestdao.herokuapp.com",
        },
      })
      .then((response) => {
        // response.setHeader("Access-Control-Allow-Credentials", true);
        // response.setHeader(
        //   "Access-Control-Allow-Origin",
        //   "http://localhost:3000"
        // );
        console.log(response.config.xsrfCookieName);
      });
    // const reponse = await getAuth(
    //   "https://nearestdao.herokuapp.com/sign-up",
    //   userDetails,
    //   "POST"
    // );
    // httpClient.sendRequest("POST", "/token/", null, userDetails);
  };

  return (
    <div className={classes.signUpPageWrapper}>
      <h1>Wellcome back!</h1>
      <Form
        formConfig={joinNowConfig}
        onSubmit={onSubmitHandler}
        // onLoading={uiData.loading}
      >
        <Button type="blue">Sign up</Button>
        {/* <UIMessage uiData={uiData} /> */}
      </Form>
      <p>
        Already have an account? Please <Link href="/signup">sign in.</Link>
      </p>
    </div>
  );
};

export default SignUpPage;
