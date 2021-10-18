import { useEffect } from "react";
import Head from "next/head";

export default function Index() {
  useEffect(() => {
    const [hash, query] = location.hash.split("#")[1]?.split("?") ?? ["", ""];
    const token = hash.split("=")[1];
    const searchParams = new URLSearchParams(query);
    const tokenType = searchParams.get("token_type");
    const scope = searchParams.get("scope");
    const company = scope?.split(":")[1];

    if (token && tokenType && company) {
      halloweenify(token, tokenType, company);
    }
  }, []);

  return (
    <Page>
      <Head>
        <title>Halloweenify</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Content>
        <h1 className="text-6xl font-bold">Halloweenifying...</h1>
      </Content>
    </Page>
  );
}

function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      {children}
    </div>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
      {children}
    </main>
  );
}

function halloweenify(token: string, tokenType: string, company: string) {
  fetch("/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, tokenType, company }),
  }).catch((error) => {
    console.error(error);
  });
}
