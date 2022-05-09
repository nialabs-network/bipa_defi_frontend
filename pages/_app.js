import { AppContextProvider, Web3ContextProvider } from "../Contexts";
import AppLayout from "../Components/Layouts/AppLayout";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import Head from "next/head";

function Dapp({ Component, pageProps, Language }) {
  console.log(
    "________________________________app.js__________________________________________"
  );
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <AppContextProvider Language={Language}>
        <Web3ContextProvider>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
          <ToastContainer
            hideProgressBar
            position="top-right"
            autoClose={1000}
            pauseOnFocusLoss={false}
            transition={Slide}
            closeButton={false}
            draggable={false}
          />
        </Web3ContextProvider>
      </AppContextProvider>
    </>
  );
}
Dapp.getInitialProps = ({ ctx }) => {
  if (ctx.req) {
    return {
      Language:
        ctx.req.cookies?.Language === undefined
          ? "en-US"
          : ctx.req.cookies.Language,
    };
  } else {
    return {};
  }
};

export default Dapp;
