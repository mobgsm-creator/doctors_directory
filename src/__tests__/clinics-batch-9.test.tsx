//vercel ./test-reports
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ClinicDetailsMarkdown from '@/components/Clinic/clinicDetailsMD';
import { Clinic } from '@/lib/types';
import fs from 'fs';
import path from 'path';
import { set } from 'zod';
import { locations, modalities } from '@/lib/data';
import TestServicesCount from '@/components/test/testServicesCount';
import TestTreatmentCount from '@/components/test/testTreatmentsCount';
import TestClinicsCount from '@/components/test/testClinicsCount';
const logFile = fs.createWriteStream('test-9.log', { flags: 'w' });
const originalLog = console.log;
console.log = (...args) => {
  originalLog(...args);
  logFile.write(args.join(' ') + '\n');
};
const filePath = path.join(process.cwd(), 'public', 'clinics_processed_new_data.json');
const all_clinics: Clinic[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const clinics = all_clinics.slice(4000,4500)
const city_treatments = locations.flatMap((cityslug) =>
  modalities.map((treatmentslug) => ({
    cityslug,
    treatmentslug,
  }))
);
// describe('PractTreatmentPage rendering', () => {

//   test.each(city_treatments)(
//     'Page test: $cityslug / $treatmentslug',
//     ({ cityslug, treatmentslug }) => {

//       let renderFlag = false;
//       let cardFlag = false

//       try {
//         const { unmount } = render(
//           <TestTreatmentCount
//             params={{ cityslug, treatmentslug }}
//           />
//         );

//         const ClinicsList = screen.getAllByTestId('practitioner-card');
//         cardFlag = true

//         console.log(
//           `/directory/practitioners/${cityslug}/treatments/${treatmentslug}: ${ClinicsList.length} cards found.`
//         );

//         renderFlag = true;
//         unmount();

//       } catch (e) {
//         console.log(
//           `Error at /directory/practitioners/${cityslug}/treatments/${treatmentslug}`,
          
//         );
//       }
//       const failures: string[] = [];
//       if(!renderFlag) failures.push("Render failed");
//       if(!cardFlag) failures.push("No cards found");

//       if (failures.length > 0) {
//         throw new Error(
//           `\n/directory/practitioners/${cityslug}/treatments/${treatmentslug} failed:\n` +
//           failures.map(f => ` - ${f}`).join("\n")
//         );
//       }

   
//     }
//   );

// });
// describe('ClinicTreatmentPage rendering', () => {

//   test.each(city_treatments)(
//     'Page test: $cityslug / $treatmentslug',
//     ({ cityslug, treatmentslug }) => {
//       const serviceslug = treatmentslug
      

//       let renderFlag = false;
//       let cardFlag = false
//       try {
//         const { unmount } = render(
//           <TestServicesCount
//             params={{ cityslug,serviceslug }}
//           />
//         );

//         const ClinicsList = screen.getAllByTestId('practitioner-card');

//         console.log(
//           `/directory/clinics/${cityslug}/services/${treatmentslug}: ${ClinicsList.length} cards found.`
//         );

//         renderFlag = true;
//         unmount();

//       } catch (e) {
//         console.log(
//           `Error at /directory/clinics/${cityslug}/services/${treatmentslug}`,
          
//         );
//       }
//       const failures: string[] = [];
//       if(!renderFlag) failures.push("Render failed");
//       if(!cardFlag) failures.push("No cards found");
      
//       if (failures.length > 0) {
//         throw new Error(
//           `\n/directory/clinics/${cityslug}/services/${treatmentslug} failed:\n` +
//           failures.map(f => ` - ${f}`).join("\n")
//         );
//       }
//     }
//   );

// });
describe('ClinicPage rendering', () => {
  afterEach(() => {
    cleanup();
    if (global.gc) {
      global.gc();
    }
  });
  test.each(clinics as Clinic[])('Page test: $slug', (clinic) => {
  //all city/clinic combinations render without crashing'
   
      let flag = false
      const slug = clinic.slug!;
      const cityslug = clinic.City;
      let aboutflag = false
      let accreditationsflag = false
      let insuranceflag = false
      let feesflag = false
      let hoursflag = false
      let paymentsflag = false

        const { unmount } = render(
          <TestClinicsCount params={{ cityslug, slug }} />
          
        );
        flag = true

        console.log(`/directory/clinics/${cityslug}/clinic/${slug} rendered successfully`);
      try {
    

        const text = screen.getAllByTestId('about');
        
        if (text) {
          if (
            text[0].textContent?.toLowerCase().includes("not listed") ||
            text[0].textContent?.toLowerCase().includes("not public")
          ) {
            console.log("not listed or not public");
          }

          if (text[0].textContent?.toLowerCase().match(/[Ãâ][\x80-\xBF]/)) {
            console.log("mojibake");
          }

          const textLength = text[0].textContent?.length;

          if (textLength && textLength > 50) {
            aboutflag = true
            console.log("about section is longer than 50 characters");
          } else {
            console.log("about section is not longer than 50 characters");
          }
        }


      } catch (e) {
        console.log(`About Section Error at /directory/clinics/${cityslug}/clinic/${slug} ${e}`);
      }
      try {

        const ulElements = screen.getAllByTestId('accreditations-list');
        const accreditationsSection = screen.getAllByText('Accreditations', {
          selector: 'h2'
        });

        ulElements.forEach(ul => {
          const liTags = ul.querySelectorAll('li');

          if (liTags.length === 0) {
            console.log("no li tags in accreditations");
          } else {
            console.log(`accreditations section has ${liTags.length} li tags`);
            accreditationsflag = true

            liTags.forEach(li => {
              const text =
                li.textContent?.replace(/[\s\u00A0\u200B\u200C\u200D\uFEFF]/g, '').trim() ?? '';

              if (
                text.toLowerCase().includes("not listed") ||
                text.toLowerCase().includes("not public")
              ) {
                console.log("accreditations section has not listed or not public");
              } else {
                console.log("accreditations section has no not listed or not public");
              }

              if (text.toLowerCase().match(/[Ãâ][\x80-\xBF]/)) {
                console.log("mojibake");
              }
            });
          }
        });


      } catch (e) {
        console.log(`Accreditations Section Error at /directory/clinics/${cityslug}/clinic/${slug} ${e}`);
      }
      try {


        const ulElementsInsurance = screen.getAllByTestId('insurance');

        ulElementsInsurance.forEach(ul => {
          const liTags = ul.querySelectorAll('li');

          if (liTags.length === 0) {
            console.log("no li tags in Insurance");
          } else {
            console.log(`insurance section has ${liTags.length} li tags`);
            insuranceflag = true

            liTags.forEach(li => {
              const text =
                li.textContent?.replace(/[\s\u00A0\u200B\u200C\u200D\uFEFF]/g, '').trim() ?? '';

              if (text.toLowerCase().match(/[Ãâ][\x80-\xBF]/)) {
                console.log("mojibake found");
              }
            });
          }
        });

      } catch (e) {
        console.log(`Insurance Section Error at /directory/clinics/${cityslug}/clinic/${slug} ${e}`);
      }
      try {

        const feesTable = screen.getAllByTestId('fees');

        feesTable.forEach(ul => {
          const trTags = ul.querySelectorAll('tr');

          if (trTags.length === 0) {
            console.log("no tr tags in Fees");
          } else {
            console.log(`Fees section has ${trTags.length} tr tags`);
            feesflag = true

            trTags.forEach(tr => {
              const tds = tr.querySelectorAll('td');

              tds.forEach(td => {
                const text =
                  td.textContent?.replace(/[\s\u00A0\u200B\u200C\u200D\uFEFF]/g, '').trim() ?? '';

                if (text.toLowerCase().match(/[Ãâ][\x80-\xBF]/)) {
                  console.log("mojibake found");
                }
              });
            });
          }
        });


      } catch (e) {
        console.log(`Fees Section Error at /directory/clinics/${cityslug}/clinic/${slug} ${e}`);
      }
      try {

        const hoursTable = screen.getAllByTestId('hours');

        hoursTable.forEach(ul => {
          const trTags = ul.querySelectorAll('tr');

          if (trTags.length === 0) {
            console.log("no tr tags in Hours");
          } else {
            console.log(`Hours section has ${trTags.length} tr tags`);
            hoursflag = true

            trTags.forEach(tr => {
              const tds = tr.querySelectorAll('td');

              tds.forEach(td => {
                const text =
                  td.textContent?.replace(/[\s\u00A0\u200B\u200C\u200D\uFEFF]/g, '').trim() ?? '';

                if (text.toLowerCase().match(/[Ãâ][\x80-\xBF]/)) {
                  console.log("mojibake");
                }
              });
            });
          }
        });

  
      } catch (e) {
        console.log(`Hours Section Error at /directory/clinics/${cityslug}/clinic/${slug} ${e}`);
      }
      try {
       

        const ulElementPayments = screen.getAllByTestId('payments');

        ulElementPayments.forEach(ul => {
          const liTags = ul.querySelectorAll('li');

          if (liTags.length === 0) {
            console.log("no li tags in payments");
          } else {
            console.log(`payments section has ${liTags.length} li tags`);
            paymentsflag = true

            liTags.forEach(li => {
              const text =
                li.textContent?.replace(/[\s\u00A0\u200B\u200C\u200D\uFEFF]/g, '').trim() ?? '';

              if (text.toLowerCase().match(/[Ãâ][\x80-\xBF]/)) {
                console.log("mojibake");
              }
            });
          }
        });

    
      } catch (e) {
        console.log(`Payments Section Error at /directory/clinics/${cityslug}/clinic/${slug} ${e}`);
      }
      unmount();
      const failures: string[] = [];

      if (!flag) failures.push("Render failed");
      if (!aboutflag) failures.push("About section failed");
      if (!accreditationsflag) failures.push("Accreditations section failed");
      if (!insuranceflag) failures.push("Insurance section failed");
      if (!feesflag) failures.push("Fees section failed");
      if (!hoursflag) failures.push("Hours section failed");
      if (!paymentsflag) failures.push("Payments section failed");

      if (failures.length > 0) {
        throw new Error(
          `\nClinic ${slug} (${cityslug}) failed:\n` +
          failures.map(f => ` - ${f}`).join("\n")
        );
      }


        
  });


});


