import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function fetchAndExtractPdfText(pdfUrl: string) {
  const response = await fetch(pdfUrl);
  const blob = await response.blob();

  const arrayBuffer = await blob.arrayBuffer();

  const loader = new PDFLoader(new Blob([arrayBuffer]));
  const docs = await loader.load();

  //combine all pages into a single string
  const docsString = docs.map((doc) => doc.pageContent).join("\n");

  return docsString;
}
