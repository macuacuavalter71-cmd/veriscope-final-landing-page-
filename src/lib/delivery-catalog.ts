/**
 * Delivery catalogue — what each purchased item gives access to.
 *
 * Only real, stored files are referenced here. Nothing is invented: a product
 * without a stored file simply shows fewer buttons.
 */
import primeDoc from "@/assets/prime-doc.asset.json";
import intelligenceDoc from "@/assets/intelligence-doc.asset.json";
import edgeExcel from "@/assets/edge-excel.asset.json";
import checklistExcel from "@/assets/checklist-excel.asset.json";
import checklistPdf from "@/assets/checklist-pdf.asset.json";
import promptPackPdf from "@/assets/prompt-pack-pdf.asset.json";

export type DeliveryFile = {
  label: string;
  url: string;
  filename: string;
  format: string;
};

export type DeliveryProduct = {
  id: string;
  name: string;
  description: string;
  /** Pine Script is fetched from the server only for products the buyer owns. */
  pine: boolean;
  files: DeliveryFile[];
};

function file(
  label: string,
  format: string,
  asset: { url: string; original_filename: string },
): DeliveryFile {
  return { label, format, url: asset.url, filename: asset.original_filename };
}

export const DELIVERY_CATALOG: Record<string, DeliveryProduct> = {
  prime: {
    id: "prime",
    name: "Veriscope Prime",
    description:
      "Estrutura, liquidez, zonas e contexto de múltiplos períodos reunidos diretamente no gráfico.",
    pine: true,
    files: [file("Baixar documento", "Documento", primeDoc)],
  },
  edge: {
    id: "edge",
    name: "Veriscope Edge",
    description:
      "19 ferramentas de suporte — risco, dimensionamento, diário e performance — num único workbook.",
    pine: false,
    files: [file("Baixar Excel", "Excel editável", edgeExcel)],
  },
  intelligence: {
    id: "intelligence",
    name: "Veriscope Intelligence",
    description:
      "A camada de avaliação da informação: ajuda a organizar o que merece atenção dentro do gráfico.",
    pine: true,
    files: [file("Baixar documento", "Documento", intelligenceDoc)],
  },
  checklist: {
    id: "checklist",
    name: "Veriscope Trade Checklist",
    description: "Um checklist prático para organizar sua análise antes de uma operação.",
    pine: false,
    files: [
      file("Baixar Excel editável", "Excel editável", checklistExcel),
      file("Baixar PDF", "PDF", checklistPdf),
    ],
  },
  "prompt-pack": {
    id: "prompt-pack",
    name: "Veriscope AI Prompt Pack",
    description:
      "Um conjunto de prompts criado para complementar o uso do Veriscope Intelligence.",
    pine: false,
    files: [file("Baixar AI Prompt Pack", "PDF", promptPackPdf)],
  },
};

/** Fixed presentation order on the delivery page. */
export const DELIVERY_ORDER = [
  "prime",
  "edge",
  "intelligence",
  "prompt-pack",
  "checklist",
];
