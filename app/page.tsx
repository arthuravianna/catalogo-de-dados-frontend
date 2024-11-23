import Link from "next/link";

export default async function Home() {

  return (
    <main className="h-lvh">
      <header className="w-full rounded-md top-0 sticky flex justify-center h-fit">
        <div className="max-w-5xl flex gap-8 p-5">
          <Link href="/about" className="hover:underline text-xl font-bold">
            About
          </Link>

          <Link href="/team" className="hover:underline text-xl font-bold">
            Team
          </Link>
        </div>
      </header>

      <div className="w-full flex flex-col items-center gap-32">
        <p className="text-center w-96">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean hendrerit mi orci, eget porta orci pretium in. Aliquam euismod eros lorem, in dignissim nulla maximus.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 content-center">
          <Link href="/datasources">
            <div className="card">
              <div className="content">
                {/* <img class="logo" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/76882/logo.svg" alt="mparticle"> */}
                <h1>Fontes de Dados</h1>
                <h6>Explore as fontes de dados da RNP</h6>
                
                <div className="hover_content">
                  <p>Explore as diversas fontes de dados da RNP com medições de PoP para PoP e PoP para cliente.</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/datatypes">
            <div className="card">
              <div className="content">
                {/* <img class="logo" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/76882/logo.svg" alt="mparticle"> */}
                <h1>Tipos de Dados</h1>
                <h6>Explore os tipos de dados da RNP</h6>
                
                <div className="hover_content">
                  <p>Explore os diversas tipos de dados que a RNP tem a oferecer.</p>
                </div>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </main>
  );
}
