export interface DesignElement {
  id: string;
  type: "text" | "image";
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  rotation: number;
  content?: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  url?: string;
  uploading?: boolean;
}
