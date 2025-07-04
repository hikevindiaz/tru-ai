// 'use client';

import { RiExternalLinkLine } from '@remixicon/react';

import { AreaChart } from '@/components/AreaChart';
import { Card } from '@/components/Card';

function valueFormatter(number: number) {
  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    notation: 'compact',
    compactDisplay: 'short',
  });
  return formatter.format(number);
}

const data = [
  {
    date: 'Jan 23',
    Balance: 38560,
  },
  {
    date: 'Feb 23',
    Balance: 40320,
  },
  {
    date: 'Mar 23',
    Balance: 50233,
  },
  {
    date: 'Apr 23',
    Balance: 55123,
  },
  {
    date: 'May 23',
    Balance: 56000,
  },
  {
    date: 'Jun 23',
    Balance: 100000,
  },
  {
    date: 'Jul 23',
    Balance: 85390,
  },
  {
    date: 'Aug 23',
    Balance: 80100,
  },
  {
    date: 'Sep 23',
    Balance: 75090,
  },
  {
    date: 'Oct 23',
    Balance: 71080,
  },
  {
    date: 'Nov 23',
    Balance: 68041,
  },
  {
    date: 'Dec 23',
    Balance: 60143,
  },
];

export default function Example() {
  return (
    <>
      <Card className="overflow-hidden p-0 sm:mx-auto sm:w-full">
        <div className="p-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-500">Balance</p>
          <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
            $60,143
          </p>
          <AreaChart
            data={data}
            index="date"
            categories={['Balance']}
            showLegend={false}
            yAxisWidth={45}
            valueFormatter={valueFormatter}
            fill="solid"
            className="mt-8 hidden h-60 sm:block"
          />
          <AreaChart
            data={data}
            index="date"
            categories={['Balance']}
            showLegend={false}
            showYAxis={false}
            startEndOnly={true}
            valueFormatter={valueFormatter}
            fill="solid"
            className="mt-8 h-48 sm:hidden"
          />
        </div>
        <div className="rounded-b-md border-t border-neutral-200 bg-neutral-50 px-6 py-4 dark:border-neutral-900 dark:bg-[#090E1A]">
          <div className="flex justify-between">
            <span className="inline-flex select-none items-center rounded-xl bg-white px-2 py-1 text-xs font-medium text-neutral-700 ring-1 ring-inset ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:ring-neutral-400/20">
              Team access
            </span>
            <div className="flex items-center gap-2">
              <a
                href="#"
                className="flex items-center gap-1.5 text-sm text-blue-500 hover:underline hover:underline-offset-4 dark:text-blue-500"
              >
                View transactions
                <RiExternalLinkLine
                  className="size-4 shrink-0"
                  aria-hidden="true"
                />
              </a>
              <span
                className="hidden h-6 w-px bg-neutral-200 dark:bg-neutral-800 sm:block"
                aria-hidden={true}
              />
              <a
                href="#"
                className="hidden items-center gap-1.5 text-sm text-blue-500 hover:underline hover:underline-offset-4 dark:text-blue-500 sm:flex"
              >
                View statements
                <RiExternalLinkLine
                  className="size-4 shrink-0"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}