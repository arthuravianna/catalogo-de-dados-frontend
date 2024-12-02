import Link from "next/link";

function DataCatalogCard({href, title, subtitle, desc, disable=false}:
{href:string, title:string, subtitle:string, desc:string, disable?:boolean}) {
  return (
    <Link href={href}
    className={`${disable ? "grayscale pointer-events-none" : ""}`}
    aria-disabled={disable} 
    tabIndex={disable ? -1 : undefined}>
        <div className="card">
            <div className="content">
                <h1>{title}</h1>
                <h6>{subtitle}</h6>
                
                <div className="hover_content">
                    <p>{desc}</p>
                </div>
            </div>
        </div>
    </Link>
  )
}

export default DataCatalogCard