export default function PdfFrame({ src }) {
  const url = `${src}#page=${1}&zoom=${75}`;
  return (
    <object
      data={url}
      type="application/pdf"
      style={{ width: "100%", minHeight: "100vh", margin: "0 0 170px 0" }}
    >
      <p>
        Your browser can’t display PDFs inline.
        <a href={src} target="_blank" rel="noopener">
          Open the PDF
        </a>
      </p>
    </object>
  );
}
