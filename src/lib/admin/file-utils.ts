import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'public')

export async function readJsonFile(filename: string): Promise<any> {
  const filePath = path.join(DATA_DIR, filename)
  const content = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(content)
}

export async function writeJsonFile(filename: string, data: any): Promise<void> {
  const filePath = path.join(DATA_DIR, filename)
  const content = JSON.stringify(data, null, 2)
  await fs.writeFile(filePath, content, 'utf-8')
}
