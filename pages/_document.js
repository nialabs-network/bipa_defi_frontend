import { Html, Head, Main, NextScript } from "next/document";

export default function Document({ __NEXT_DATA__ }) {
  return (
    <Html lang={__NEXT_DATA__.props.Language}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = async (props) => {
  const html = props.renderPage().html;
  return { html };
};
