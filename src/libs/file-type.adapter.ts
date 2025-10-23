// Prevent TS from rewriting `import()` into `require()` in CJS builds.

import { FileTypeResult } from "file-type"

// This works in Jest and in a Nest.js (CJS) runtime.
type FileTypeModule = typeof import("file-type")

let fileTypeModPromise: Promise<FileTypeModule> | undefined

async function getFileTypeModule(): Promise<FileTypeModule> {
  if (!fileTypeModPromise) {
    // Use eval so TS leaves this as native dynamic import at runtime
    fileTypeModPromise = (0, eval)('import("file-type")') as Promise<FileTypeModule>
  }
  return fileTypeModPromise
}

export type { FileTypeResult } from "file-type"

export async function fileTypeFromBuffer(buffer: Buffer): Promise<FileTypeResult | undefined> {
  const mod = await getFileTypeModule()
  return mod.fileTypeFromBuffer(buffer)
}

export async function fileTypeFromStream(stream: NodeJS.ReadableStream): Promise<FileTypeResult | undefined> {
  const mod = await getFileTypeModule()
  return mod.fileTypeFromStream(stream as any)
}

export async function fileTypeFromBlob(blob: Blob): Promise<FileTypeResult | undefined> {
  const mod = await getFileTypeModule()
  return mod.fileTypeFromBlob(blob)
}

export async function getSupportedMimeTypes(): Promise<ReadonlySet<string>> {
  const mod = await getFileTypeModule()
  return mod.supportedMimeTypes
}
