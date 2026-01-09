"use server";

import { redirect } from 'next/navigation';

export async function searchTreatments(formData: FormData) {
  const query = formData.get('query') as string;
  if (query) {
    redirect(`/treatments?query=${encodeURIComponent(query)}`);
  } else {
    redirect('/treatments');
  }
}