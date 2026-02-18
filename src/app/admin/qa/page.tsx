'use client'

import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { CheckCircle, XCircle, Clock, FileText, AlertTriangle, Droplet } from 'lucide-react'
import testReport from '@/../test-reports/output.json'

const testDetails = {
  "ClinicPage rendering": {
    "About Section": {
      description: "Validates presence, minimum length, and content integrity of About section.",
      checks: [
        "Section exists in DOM",
        "Text length > 50 characters",
        "Does not contain 'not listed'",
        "Does not contain 'not public'",
        "Does not contain corrupted characters (mojibake)"
      ]
    },
    "Accreditations": {
      description: "Validates accreditation section structure and content integrity.",
      checks: [
        "Section exists in DOM",
        "Contains <li> items",
        "List is not empty",
        "No item contains 'not listed'",
        "No item contains 'not public'",
        "No corrupted characters (mojibake)"
      ]
    },
    "Insurance": {
      description: "Validates insurance section structure and content integrity.",
      checks: [
        "Section exists in DOM",
        "Contains insurance entries",
        "Entries are not empty",
        "No corrupted characters (mojibake)"
      ]
    },
    "Fees": {
      description: "Validates fees table structure and content integrity.",
      checks: [
        "Fees table exists",
        "Contains <tr> rows",
        "Rows are not empty",
        "Table cells do not contain corrupted characters (mojibake)"
      ]
    },
    "Hours": {
      description: "Validates hours table structure and content integrity.",
      checks: [
        "Hours table exists",
        "Contains <tr> rows",
        "Rows are not empty",
        "No corrupted characters (mojibake)"
      ]
    },
    "Payments": {
      description: "Validates payments section structure and content integrity.",
      checks: [
        "Section exists in DOM",
        "Contains payment entries",
        "Entries are not empty",
        "No corrupted characters (mojibake)"
      ]
    }
  }
};

interface AssertionResult {
  ancestorTitles: string[]
  duration: number
  failing: boolean
  failureDetails: unknown[]
  failureMessages: string[]
  fullName: string
  invocations: number
  location: { column: number; line: number } | null
  numPassingAsserts: number
  retryReasons: string[]
  startAt: number
  status: 'passed' | 'failed' | 'pending' | 'skipped' | 'todo'
  title: string
}

interface TestSuiteResult {
  assertionResults: AssertionResult[]
  endTime: number
  message: string
  name: string
  startTime: number
  status: 'passed' | 'failed' | 'pending' | 'skipped'
  summary: string
}

interface TestReport {
  numFailedTestSuites: number
  numFailedTests: number
  numPassedTestSuites: number
  numPassedTests: number
  numPendingTestSuites: number
  numPendingTests: number
  numRuntimeErrorTestSuites: number
  numTodoTests: number
  numTotalTestSuites: number
  numTotalTests: number
  openHandles: unknown[]
  snapshot: {
    added: number
    didUpdate: boolean
    failure: boolean
    filesAdded: number
    filesRemoved: number
    filesRemovedList: string[]
    filesUnmatched: number
    filesUpdated: number
    matched: number
    total: number
    unchecked: number
    uncheckedKeysByFile: string[]
    unmatched: number
    updated: number
  }
  startTime: number
  success: boolean
  testResults: TestSuiteResult[]
  wasInterrupted: boolean
}

const report = testReport as TestReport

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  const seconds = (ms / 1000).toFixed(2)
  return `${seconds}s`
}

function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString()
}

function stripAnsiCodes(str: string): string {
  return str.replace(/\u001b\[[0-9;]*m/g, '')
}

function extractFileName(path: string): string {
  return path.split(/[/\\]/).pop() || path
}

export default function QATestReport() {
  const failedTests = report.testResults.flatMap(suite =>
    suite.assertionResults.filter(test => test.status === 'failed')
  )

  return (
    <AdminLayout title="QA Test Report">
      <div className="space-y-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="specs">Specs</TabsTrigger>
            <TabsTrigger value="failed">
              Failed Tests
              {report.numFailedTests > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {report.numFailedTests}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all">All Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-500">Total Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{report.numTotalTests}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-500">Passed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="text-3xl font-bold text-green-600">{report.numPassedTests}</div>
                  </div>
                  <Badge variant="outline" className="mt-2 text-green-600 border-green-600">
                    {((report.numPassedTests / report.numTotalTests) * 100).toFixed(1)}% pass rate
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-500">Failed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <div className="text-3xl font-bold text-red-600">{report.numFailedTests}</div>
                  </div>
                  <Badge variant="destructive" className="mt-2">
                    {((report.numFailedTests / report.numTotalTests) * 100).toFixed(1)}% failure rate
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-500">Test Suites</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{report.numTotalTestSuites}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {report.numPassedTestSuites} passed, {report.numFailedTestSuites} failed
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-500">Test Run Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <div className="text-3xl font-bold">
                      {formatDuration(report.testResults.reduce((acc, suite) => acc + (suite.endTime - suite.startTime), 0))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {formatTimestamp(report.startTime)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-500">Overall Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {report.success ? (
                    <Badge variant="default" className="text-sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Passed
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-sm">
                      <XCircle className="w-4 h-4 mr-1" />
                      Failed
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </div>

            {report.numFailedTests > 0 && (
              <Card className="border-red-200 bg-red-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-900">
                    <AlertTriangle className="w-5 h-5" />
                    Failed Tests Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {failedTests.map((test, index) => (
                      <div key={index} className="p-3 bg-white rounded border border-red-200">
                        <div className="flex items-start gap-2">
                          <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-red-900">{test.fullName}</div>
                      
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="specs" className="space-y-4">
            {Object.entries(testDetails).map((suite:any, section:any ) => (
              <Accordion type="single" collapsible className="space-y-4">
                
                <AccordionItem value={suite[0]}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-start text-lg font-bold">
                    {`${suite[0]}`}</div></AccordionTrigger>

                 <AccordionContent>
                      <div className="space-y-3">
                        {Object.entries(suite[1]).map((test:any, testIndex:any) => (
                          <>
                          <div
                            key={testIndex}
                            className={`p-3 rounded border`}
                            >
                          
                            
                      {Object.entries(test[1]).map((test:any, testIndex:any) => (
                        <div className='p-4 text-lg'>{Array.isArray(test[1]) ? test[1].map((item) => <li className='text-sm'>{item}</li>) :test[1]}</div>
                   
                      ))}</div></>
                    ))}
                    </div>
                    </AccordionContent></AccordionItem>
                  </Accordion>
            
                  ))}
          </TabsContent>

          <TabsContent value="failed" className="space-y-4">
            {failedTests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900">All Tests Passed!</h3>
                  <p className="text-gray-500 mt-2">No failed tests to display.</p>
                </CardContent>
              </Card>
            ) : (
              failedTests.map((test, index) => (
                <Card key={index} className="border-red-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-900">
                      <XCircle className="w-5 h-5" />
                      {test.fullName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        Duration: {formatDuration(test.duration)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="w-4 h-4" />
                        {extractFileName(report.testResults.find(s => s.assertionResults.includes(test))?.name || '')}
                      </div>
                      <div className="mt-4">
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Error Message:</h4>
                        <pre className="bg-red-50 p-3 rounded text-sm text-red-900 overflow-x-auto">
                          {stripAnsiCodes(test.failureMessages.join('\n'))}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            <Accordion type="single" collapsible className="space-y-4">
              {report.testResults.map((suite, suiteIndex) => {
                const suiteDuration = suite.endTime - suite.startTime
                const suitePassed = suite.status === 'passed'

                return (
                  <AccordionItem key={suiteIndex} value={`suite-${suiteIndex}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 flex-1">
                        {suitePassed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="font-medium">{extractFileName(suite.name)}</span>
                        <Badge variant={suitePassed ? "default" : "destructive"} className="ml-auto">
                          {suitePassed ? 'Passed' : 'Failed'}
                        </Badge>
                        <Badge variant="outline">
                          {suite.assertionResults.length} tests
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {formatDuration(suiteDuration)}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-8 pt-2 space-y-2">
                        {suite.assertionResults.map((test, testIndex) => (
                          <div
                            key={testIndex}
                            className={`p-3 rounded border ${
                              test.status === 'failed'
                                ? 'bg-red-50 border-red-200'
                                : 'bg-green-50 border-green-200'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {test.status === 'failed' ? (
                                <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                              ) : (
                                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900">{test.title}</div>
                                <div className="text-sm text-gray-600 mt-1">
                                  Duration: {formatDuration(test.duration)}
                                </div>
                                {test.status === 'failed' && test.failureMessages.length > 0 && (
                                  <details className="mt-2">
                                    <summary className="cursor-pointer text-sm text-red-700 font-medium hover:text-red-800">
                                      View error details
                                    </summary>
                                    <pre className="mt-2 p-3 bg-white rounded text-sm text-red-900 overflow-x-auto whitespace-pre-wrap">
                                      {stripAnsiCodes(test.failureMessages.join('\n'))}
                                    </pre>
                                  </details>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
