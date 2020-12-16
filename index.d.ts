declare module 'pdftk-fill-pdf' {
  export function fill<T extends object>(params: { pdfPath: string; data: T; } ): Promise<T>;
}
