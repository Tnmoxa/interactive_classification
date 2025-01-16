import { observer } from "mobx-react-lite";
import { useState } from "react";
import { fastFetch } from "@/modules/fastapi";
import { AccountInfo } from "@/modules/account";
import { Spinner } from "@nextui-org/spinner";

const Test = observer(() => {
  const [active, setActive] = useState(false);

  const session = sessionStorage.getItem("session");
  console.log(session, "qweqweqwe");
  if (session) {
    const { email, session_key } = JSON.parse(session);
    const requestObject = new Request(
      process.env.REACT_APP_API_URL
        ? process.env.REACT_APP_API_URL + `/api/auth/test_session?session_key=${session_key}`
        : `/api/auth/test_session?session_key=${session_key}`,
      {
        method: "GET",
      },
    );
    fastFetch<any>(requestObject)
      .then(() => {
        setActive(true);
      })
      .catch((error) => (error.status === 404 ? setActive(false) : console.error(error)));
  }

  return <>{active ? <>Сессия есть</> : <Spinner size="lg" />}</>;
});

export default Test;
