import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ClinicDetailsMarkdown from '@/components/Clinic/clinicDetailsMD';
import { Clinic } from '@/lib/types';
import fs from 'fs';
import path from 'path';
const logFile = fs.createWriteStream('test-output.log', { flags: 'w' });
const originalLog = console.log;
console.log = (...args) => {
  originalLog(...args);
  logFile.write(args.join(' ') + '\n');
};
const filePath = path.join(process.cwd(), 'public', 'clinics_processed_new.json');
const all_clinics: Clinic[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const clinics = all_clinics.slice(0,10)
describe('ClinicDetailsMarkdown - Accreditations Section', () => {
  let liTagCounts: Map<string, number> = new Map();
  let renderErrors: { slug: string; error: string }[] = [];

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

  test('should have Accreditations section for successfully rendered clinics', () => {
    let clinicsWithSection = 0;
    let clinicsWithoutSection = 0;

    clinics.forEach((clinic) => {
      try {
        const { unmount } = render(<ClinicDetailsMarkdown clinic={clinic} />);
        
        const accreditationsSection = screen.getAllByText('Accreditations', { 
          selector: 'h2'
        });
        
        if (accreditationsSection) {
          clinicsWithSection++;
        } else {
          clinicsWithoutSection++;
        }
        
        unmount();
      } catch (error) {


      }
    });

    console.log(`\n========== ACCREDITATIONS SECTION SUMMARY ==========`);
    console.log(`Clinics with Accreditations section: ${clinicsWithSection}`);
    console.log(`Clinics without Accreditations section: ${clinicsWithoutSection}`);
 

    
    
    expect(clinicsWithSection).toBeGreaterThanOrEqual(10);
  });

  test('should count li tags in Accreditations section', () => {
    const clinicsWithAccreditations: string[] = [];
    const clinicsWithNoAccreditations: { slug: string; count: number }[] = [];

    clinics.forEach((clinic) => {
      try {
        const { unmount } = render(<ClinicDetailsMarkdown clinic={clinic} />);
        
        const accreditationsSection = screen.getAllByText('Accreditations', { 
          selector: 'h2'
        });
        if (accreditationsSection) {
          const ulElements = screen.getAllByTestId('accreditations-list');

          ulElements.forEach(ul => {
            const liTags = ul.querySelectorAll('li');
            const count = liTags.length;
            
            if (count > 0) {
              clinicsWithAccreditations.push(clinic.slug);
            } else {
              clinicsWithNoAccreditations.push({ slug: clinic.slug, count });
            }
          });
          if (clinicsWithNoAccreditations.length > 0) {
            console.log(`\nClinics with no accreditations:`);
            clinicsWithNoAccreditations.forEach(({ slug, count }) => {
              console.log(`- ${slug}: ${count} li tags`);
            });
          }
          
        }

        
        
   
        unmount();
      } catch (error) {
     
      }
    });

      console.log(`\n========== ACCREDITATIONS LI TAG SUMMARY ==========`);
    console.log(`Clinics with accreditations data: ${clinicsWithAccreditations.length}`);
    console.log(`Clinics without accreditations (li = 0): ${clinicsWithNoAccreditations.length}`);
    expect(clinicsWithAccreditations.length).toBeGreaterThanOrEqual(10);
    });
    test('does mojibake exst in string?', () => {
      let mojibakeCount = 0;
      const clinicsWithMojibake: { slug: string; count: number }[] = [];
      clinics.forEach((clinic) => {
      try {
        const { unmount } = render(<ClinicDetailsMarkdown clinic={clinic} />);
      
      const accreditationsSection = screen.getAllByText('Accreditations', { 
          selector: 'h2'
        });
        if (accreditationsSection) {
          const ulElements = screen.getAllByTestId('accreditations-list');

          ulElements.forEach(ul => {
            const liTags = ul.querySelectorAll('li');
            liTags.forEach(li => {
              const matches = li.textContent.match(/[Ãâ][\x80-\xBF]/);
              if (matches) {
                mojibakeCount+=matches.length
                clinicsWithMojibake.push({ slug: clinic.slug, count: matches.length });
            }});
          });
        } 
        unmount();
      }
    
      catch (error) {
      
      };
    })
    console.log(`\n========== MOJIBAKE SUMMARY ==========`);
    console.log(`Total mojibake occurrences in Accreditations: ${mojibakeCount}`);
    if (clinicsWithMojibake.length > 0) {
      console.log(`\nClinics with mojibake:`);
      clinicsWithMojibake.forEach(({ slug, count }) => {
        console.log(`- ${slug}: ${count} mojibake occurrences`);
      });
    }
    expect(mojibakeCount).toBe(0);
    
  });
 


  afterAll(() => {
    console.log(`\n========== FINAL SUMMARY ==========`);
    console.log(`Tested ${clinics.length} clinics for Accreditations section rendering`);
  });
});
