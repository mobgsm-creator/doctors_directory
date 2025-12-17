'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export type FAQInput = Record<
  string,
  string | string[] | Record<string, string | string[]>
>;

function formatQuestion(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\bvs\b/gi, "vs")
    .replace(/\bUK\b/g, "UK")
    .replace(/\bFDA\b/g, "FDA")
    .replace(/\bNICE\b/g, "NICE")
    .replace(/\bMHRA\b/g, "MHRA")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanText(text: string): string {
  return text.replace(/:contentReference\[.*?\]\{.*?\}/g, "").trim();
}

type FAQProps = {
  data: FAQInput;
  stripCitations?: boolean;
};

function renderValue(
  value: string | string[] | Record<string, any>,
  stripCitations: boolean
): JSX.Element {
  if (typeof value === "string") {
    return <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
      {stripCitations ? cleanText(value) : value}
    </p>;
  }

  if (Array.isArray(value)) {
    return (
      <ul className="space-y-2">
        {value.map((item, i) => (
          <li key={i} className="text-slate-600 dark:text-slate-300 flex items-start gap-2">
            <span className="text-blue-500 dark:text-blue-400 mt-1">•</span>
            <span className="flex-1">
              {stripCitations && typeof item === "string"
                ? cleanText(item)
                : item}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  // Nested object (Pros / Cons, Mild / Severe, etc.)
  return (
    <div className="space-y-4">
      {Object.entries(value).map(([subKey, subValue]) => (
        <div key={subKey} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
          <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
            {formatQuestion(subKey)}
          </h4>
          {renderValue(subValue, stripCitations)}
        </div>
      ))}
    </div>
  );
}

export function FAQ({ data, stripCitations = true }: FAQProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (key: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-3">
        {Object.entries(data).map(([rawKey, value]) => {
          const question = formatQuestion(rawKey);
          const isExpanded = expandedItems.has(rawKey);

          return (
            <div 
              key={rawKey}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
             
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-center text-lg pr-4">
                  {question}
                </h3>
             
           
              
              <div 
                className={`transition-all duration-300 ease-in-out 
                  'max-h-96 opacity-100' `}
              >
                <div className="px-6 pb-4">
                  <div className="text-slate-600 dark:text-slate-300">
                    {renderValue(value, stripCitations)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {Object.keys(data).length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">No FAQ items available</p>
        </div>
      )}
    </section>
  );
}
