import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ClinicDetailsMarkdown from '@/components/Clinic/clinicDetailsMD';
import { Clinic } from '@/lib/types';
import fs from 'fs';
import path from 'path';
import { set } from 'zod';
const logFile = fs.createWriteStream('test-output-1.log', { flags: 'w' });
const originalLog = console.log;
console.log = (...args) => {
  originalLog(...args);
  logFile.write(args.join(' ') + '\n');
};
const filePath = path.join(process.cwd(), 'public', 'clinics_processed_new.json');
const all_clinics: Clinic[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const clinics = all_clinics
describe('ClinicDetailsMarkdown', () => {
  let liTagCounts: Map<string, number> = new Map();
  let renderErrors: { slug: string | undefined; error: string }[] = [];

  beforeAll(() => {
    expect(clinics.length).toBeGreaterThan(0);
  });

  test('should render ClinicDetailsMarkdown component and track errors', () => {
    let renderSuccessCount = 0;
    let failedClinics = 0;

    clinics.forEach((clinic) => {
      try {
        render(<ClinicDetailsMarkdown clinic={clinic} />);
        renderSuccessCount++;
        cleanup();
      } catch (error) {
        failedClinics++;
        renderErrors.push({ 
          slug: clinic.slug, 
          error: error instanceof Error ? error.message : String(error) 
        });
      }
    });

    console.log(`\n========== RENDER SUMMARY ==========`);
    console.log(`Successfully rendered: ${renderSuccessCount}/${clinics.length} clinics`);
    console.log(`Failed to render: ${renderErrors.length} clinics`);
    
    if (renderErrors.length > 0) {
      console.log(`\nFailed clinics:`);
      renderErrors.forEach(({ slug, error }) => {
        console.log(`- ${slug}: ${error.substring(0, 100)}`);
      });
    }

    expect(renderSuccessCount).toBeGreaterThanOrEqual(10);
  });

//   test('should have Accreditations section for successfully rendered clinics', () => {
//     let clinicsWithSection = 0;
//     let clinicsWithoutSection = 0;

//     clinics.forEach((clinic) => {
//       try {
//         const { unmount } = render(<ClinicDetailsMarkdown clinic={clinic} />);
        
//         const accreditationsSection = screen.getAllByText('Accreditations', { 
//           selector: 'h2'
//         });
        
//         if (accreditationsSection) {
//           clinicsWithSection++;
//         } else {
//           clinicsWithoutSection++;
//         }
        
//         unmount();
//       } catch (error) {


//       }
//     });

//     console.log(`\n========== ACCREDITATIONS SECTION SUMMARY ==========`);
//     console.log(`Clinics with Accreditations section: ${clinicsWithSection}`);
//     console.log(`Clinics without Accreditations section: ${clinicsWithoutSection}`);
 

    
    
//      //expect(clinicsWithSection).toBeGreaterThanOrEqual(10);
//   });


  // test('should count li tags in Accreditations section', () => {
  //   const clinicsWithAccreditations: string[] = [];
  //   const clinicsWithNoAccreditations: { slug: string|undefined; count: number }[] = [];

  //   clinics.forEach((clinic) => {
  //     try {
  //       const { unmount } = render(<ClinicDetailsMarkdown clinic={clinic} />);
        
  //       const accreditationsSection = screen.getAllByText('Accreditations', { 
  //         selector: 'h2'
  //       });
  //       if (accreditationsSection) {
  //         const ulElements = screen.getAllByTestId('accreditations-list');

  //         ulElements.forEach(ul => {
  //           const liTags = ul.querySelectorAll('li');
  //           if (liTags.length === 0) {
  //             clinicsWithNoAccreditations.push({ slug: clinic.slug, count: liTags.length });
  //           } else {
  //           liTags.forEach(li => {
  //             const text = li.textContent?.replace(/[\s\u00A0\u200B\u200C\u200D\uFEFF]/g, '').trim() ?? '';
  //             if(text.toLowerCase().includes("not listed") || text.toLowerCase().includes("not public")) {
  //               clinicsWithNoAccreditations.push({ slug: clinic.slug, count: liTags.length });
  //             }
            
  //           })
  //         }
            
            
  //         });
        
          
  //       }
  //       unmount();
  //     } catch (error) {
     
  //     }
  //   });

  //     console.log(`\n========== ACCREDITATIONS LI TAG SUMMARY ==========`);
  //   console.log(`Clinics with accreditations data: ${clinicsWithAccreditations.length}`);
  //   console.log(`Clinics without accreditations (li = 0): ${clinicsWithNoAccreditations.length}`);
  //   clinicsWithNoAccreditations.forEach((clinic) => {
  //     console.log(`- ${clinic.slug}`);
  //   });
  //   expect(clinicsWithAccreditations.length).toBeGreaterThanOrEqual(0);
  // });
  // test('does about section have more than 50 characters?', () => {
  //   let aboutSectionCount = 0;
  //   let clinicsWithNoAbout = new Set<string>();
  //   clinics.forEach((clinic) => {
  //     try {
  //       const { unmount } = render(<ClinicDetailsMarkdown clinic={clinic} />);
 
  //         const text = screen.getAllByTestId('about');
       
  //         if (text) {
  //             if(text[0].textContent.toLowerCase().includes("not listed") || text[0].textContent.toLowerCase().includes("not public")) {
  //               clinicsWithNoAbout.add(clinic.slug as string);
  //             }
  //           const textLength = text[0].textContent?.length;
  //           if (textLength && textLength > 50) {
  //             aboutSectionCount++;
  //           }
  //           else {
  //             clinicsWithNoAbout.add(clinic.slug as string);
  //           }
  //         }
     
  //       unmount();
  //     } catch (error) {
  //       console.log("ERROR BEFORE UNMOUNT", error,clinic.slug);
        
  //     }
  //   });
  //   console.log(`\n========== ABOUT SECTION SUMMARY ==========`);
  //   console.log(`Clinics without about section longer than 50 characters: ${aboutSectionCount}`);
  //   clinicsWithNoAbout.forEach((clinic:string) => {
  //     console.log(`- ${clinic}`);
  //   });
  //   expect(aboutSectionCount).toBeGreaterThanOrEqual(1);
  // });
//   test('does treatment section have at least one link?', () => {
//     let treatmentCount = 0;
//     let clinicsWithNoTreatment: string[] = []
//     clinics.forEach((clinic) => {
//       try {
//         const { unmount } = render(<ClinicDetailsMarkdown clinic={clinic} />);
//         const treatmentSection = screen.getAllByText('Treatments', { 
//           selector: 'h2'
//         });
//         if (treatmentSection) {
//           const TreatmentDiv = screen.getAllByTestId('treatments');

//           const numberOfTreatments = TreatmentDiv[0].querySelectorAll('a').length

            
//             if (numberOfTreatments > 0) {
//               treatmentCount++;
//             }
//             else {
//               clinicsWithNoTreatment.push(clinic.slug as string);
//             }
//           }
//         unmount();
//       } catch (error) {
   
        
//       }
//     });
//     console.log(`\n========== TREATMENTS SECTION SUMMARY ==========`);
//     console.log(`Clinics with treatments section: ${treatmentCount}`);
//     console.log(`Clinics without treatments section: ${clinicsWithNoTreatment.length}`);
//     clinicsWithNoTreatment.forEach((clinic) => {
//       console.log(`- ${clinic}`);
//     });
//     expect(treatmentCount).toBeGreaterThanOrEqual(1);
//   });
//   test('does practitioners section have at least one link?', () => {
//     let practitionerCount = 0;
//     let clinicsWithNoPractitioner: string[] = []
//     clinics.forEach((clinic) => {
//       try {
//         const { unmount } = render(<ClinicDetailsMarkdown clinic={clinic} />);
//         const practitionerSection = screen.getAllByText('Practitioners', { 
//           selector: 'h2'
//         });
//         if (practitionerSection) {
//           const PractitionerDiv = screen.getAllByTestId('practitioners');

//           const numberOfPractitioners = PractitionerDiv[0].querySelectorAll('a').length

            
//             if (numberOfPractitioners > 0) {
//               practitionerCount++;
//             }
//             else {
//               clinicsWithNoPractitioner.push(clinic.slug as string);
//             }
//           }
//         unmount();
//       } catch (error) {
//         console.log("ERROR BEFORE UNMOUNT",clinic.slug);
//         clinicsWithNoPractitioner.push(clinic.slug as string);

        
//       }
//     });
//     console.log(`\n========== PRACTITIONERS SECTION SUMMARY ==========`);
//     console.log(`Clinics with practitioners section: ${practitionerCount}`);
//     console.log(`Clinics without practitioners section: ${clinicsWithNoPractitioner.length}`);
//     clinicsWithNoPractitioner.forEach((clinic) => {
//       console.log(`- ${clinic}`);
//   });
//   expect(practitionerCount).toBeGreaterThanOrEqual(1);
// });
  // test('does insurance section have text?', () => {
  //   let insuranceCount = 0;
  //   let clinicsWithNoInsurance: string[] = []
  //   clinics.forEach((clinic) => {
  //     try {
  //       const { unmount } = render(<ClinicDetailsMarkdown clinic={clinic} />);
  //       const insuranceSection = screen.getAllByText('Insurance Accepted', { 
  //         selector: 'h2'
  //       });
  //       if (insuranceSection) {
  //         const InsuranceDiv = screen.getAllByTestId('insurance');

  //         const numberOfInsurance = InsuranceDiv[0].textContent?.length

            
  //           if (numberOfInsurance > 50) {
  //             insuranceCount++;
  //           }
  //           else {
  //             clinicsWithNoInsurance.push(clinic.slug as string);
  //           }
  //       }
  //       unmount();
  //     } catch (error) {

        
  //     }
  //   });
  //   console.log(`\n========== INSURANCE SECTION SUMMARY ==========`);
  //   console.log(`Clinics with insurance section: ${insuranceCount}`);
  //   console.log(`Clinics without insurance section: ${clinicsWithNoInsurance.length}`);
  //   clinicsWithNoInsurance.forEach((clinic) => {
  //     console.log(`- ${clinic}`);
  //   });
  //   expect(insuranceCount).toBeGreaterThanOrEqual(1);
  // });
  // test('does fees section have text?', () => {
  //   let feesCount = 0;
  //   let clinicsWithNoFees = new Set<string>();
  //   clinics.forEach((clinic) => {
      
  //     try {
  //       const { unmount } = render(<ClinicDetailsMarkdown clinic={clinic} />);
  //       const feesSection = screen.getAllByText('Estimated Fees', { 
  //         selector: 'h2'
  //       });
  //       if (feesSection) {
  //         const FeesDiv = screen.getAllByTestId('fees');

  //         const FeesTable = FeesDiv[0].querySelectorAll('table')
  //         const trs = FeesTable[0].querySelectorAll('tr')
  //         trs.forEach(tr => {
  //           const tds = tr.querySelectorAll('td')
  //           tds.forEach(td => {
  //             const text = td.textContent?.replace(/[\s\u00A0\u200B\u200C\u200D\uFEFF]/g, '').trim() ?? '';
  //             if (text.length === 0) {
              
              
  //               clinicsWithNoFees.add(clinic.slug as string);
  //           }
  //           if(text.toLowerCase().includes("not listed") || text.toLowerCase().includes("not public")) {
  //             clinicsWithNoFees.add(clinic.slug as string);
  //           }
  //           feesCount++;
  //           })
  //         })
  //       }
  //       unmount();
  //     } catch (error) {

        
  //     }
  //   });
  //   console.log(`\n========== FEES SECTION SUMMARY ==========`);
  //   console.log(`Clinics with fees section: ${feesCount}`);
  //   console.log(`Clinics without fees section: ${clinicsWithNoFees.size}`);
  //   clinicsWithNoFees.forEach((clinic) => {
  //     console.log(`- ${clinic}`);
  //   });
  //   expect(feesCount).toBeGreaterThanOrEqual(1);
  // });

            
            
        
  //   test('does mojibake exst in string?', () => {
  //     let mojibakeCount = 0;
  //     const clinicsWithMojibake: { slug: string|undefined; count: number }[] = [];
  //     clinics.forEach((clinic) => {
  //     try {
  //       const { unmount } = render(<ClinicDetailsMarkdown clinic={clinic} />);
      
  //     const accreditationsSection = screen.getAllByText('Accreditations', { 
  //         selector: 'h2'
  //       });
  //       if (accreditationsSection) {
  //         const ulElements = screen.getAllByTestId('accreditations-list');

  //         ulElements.forEach(ul => {
  //           const liTags = ul.querySelectorAll('li');
  //           liTags.forEach(li => {
  //             const matches = li.textContent.match(/[Ãâ][\x80-\xBF]/);
  //             if (matches) {
  //               mojibakeCount+=matches.length
  //               clinicsWithMojibake.push({ slug: clinic.slug, count: matches.length });
  //           }});
  //         });
  //       } 
  //       unmount();
  //     }
    
  //     catch (error) {
      
  //     };
  //   })
  //   console.log(`\n========== MOJIBAKE SUMMARY ==========`);
  //   console.log(`Total mojibake occurrences in Accreditations: ${mojibakeCount}`);
  //   if (clinicsWithMojibake.length > 0) {
  //     console.log(`\nClinics with mojibake:`);
  //     clinicsWithMojibake.forEach(({ slug, count }) => {
  //       console.log(`- ${slug}: ${count} mojibake occurrences`);
  //     });
  //   }
  //   expect(mojibakeCount).toBe(0);
    
   });
 


  afterAll(() => {
    console.log(`\n========== FINAL SUMMARY ==========`);
    console.log(`Tested ${clinics.length} clinic`);

  });

