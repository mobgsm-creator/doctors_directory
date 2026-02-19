import { getTestReport } from "@/lib/testReport"
import QAClient from "@/components/admin/QAClient"
import type { TestReport } from "@/components/admin/QAClient"
import fs from "fs"
import path from "path"
const filePath = path.join(process.cwd(), "test-reports", "output.json")

const fileContents = fs.readFileSync(filePath, "utf-8")
const testReport: TestReport = JSON.parse(fileContents)

export default async function Page() {
  return <QAClient report={testReport} />
}
