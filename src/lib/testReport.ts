import type { TestReport } from "@/components/admin/QAClient"
export async function getTestReport() {
  const report = (await import('../../test-reports/output.json')).default
  return report as TestReport
}
