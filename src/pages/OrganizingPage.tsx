import React from "react";
import Banner from "../components/Banner";
import {intl} from "../util";
import Organizing from "../components/organizing/Organizing";

const OrganizingPage = () => {
  return(
    <>
      <Banner title={intl.organizing}/>
      <Organizing/>
    </>
  )
}

export default OrganizingPage;
