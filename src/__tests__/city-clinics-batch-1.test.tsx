import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Clinic } from '@/lib/types';
import fs from 'fs';
import path from 'path';
import { locations } from '@/lib/data';
import TestCityClinics from '@/components/test/testCityClinics';

const logFile = fs.createWriteStream('test-city-clinics-batch-1.log', { flags: 'w' });
const originalLog = console.log;
console.log = (...args) => {
  originalLog(...args);
  logFile.write(args.join(' ') + '\n');
};

const city_tests = locations.map((cityslug) => ({ cityslug }));

describe('CityClinicsPage rendering', () => {

  test.each(city_tests)(
    'Page test: $cityslug',
    ({ cityslug }) => {
      let renderFlag = false;
      let cardFlag = false;
      try {
        const { unmount } = render(
          <TestCityClinics
            params={{ cityslug, slug: 'test-slug' }}
          />
        );

        const ClinicsList = screen.getAllByTestId('practitioner-card');

        console.log(
          `/directory/clinics/${cityslug}: ${ClinicsList.length} cards found.`
        );

        renderFlag = true;
        cardFlag = ClinicsList.length > 0;
        unmount();

      } catch (e) {
        console.log(
          `Error at /directory/clinics/${cityslug}`
        );
      }
      const failures: string[] = [];
      if (!renderFlag) failures.push("Render failed");
      if (!cardFlag) failures.push("No cards found");

      if (failures.length > 0) {
        throw new Error(
          `\n/directory/clinics/${cityslug} failed:\n` +
          failures.map(f => ` - ${f}`).join("\n")
        );
      }
    }
  );

});
