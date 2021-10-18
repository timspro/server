import { dirname } from "path"
import { fileURLToPath } from "url"

export const projectDir = dirname(dirname(fileURLToPath(import.meta.url)))
