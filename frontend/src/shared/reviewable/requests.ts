import { supervisors } from '@/mocks/supervisor';
import { students } from '@/mocks/students';
import { Review, Supervisor, User } from '@/shared/models';
import {
  updateReviews,
  treatmentPlanMock,
  setNote,
  updateAssignee,
} from '@/mocks/treatment-plan';

export async function getAvailableUsers(): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return students;
}

export async function saveAssignee(id: string, selectedAssigneeId: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('Saved to backend (mock):', { id, selectedAssigneeId });

  const assignee = students.find((s) => s.id === selectedAssigneeId);

  if (!assignee) {
    throw new Error('User not found.');
  }

  updateAssignee(assignee);

  return { success: true };
}

export async function getAvailableSupervisors(): Promise<Supervisor[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return supervisors;
}

export async function saveSupervisors(
  reviewableId: string,
  selectedSupervisorIds: string[],
) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const selectedSupervisors = selectedSupervisorIds
    .map((id) => {
      return supervisors.find((sup) => sup.id === id);
    })
    .filter((val) => val !== undefined);

  const reviews = selectedSupervisors.map((sup) => {
    const existingReview = treatmentPlanMock.reviews.find(
      (rev) => rev.supervisor.id === sup.id,
    );
    if (existingReview) {
      return existingReview;
    }
    return {
      id: Math.floor(Math.random() * 10000).toString(),
      note: '',
      grade: 0.0,
      reviewStatus: 'DRAFT',
      supervisor: sup,
    } as Review;
  });

  updateReviews(reviews);

  console.log('Saved to backend (mock):', { reviewableId, reviews });
  return { success: true };
}

export async function saveDetails(reviewableId: string, note: string) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log('saving data', note, reviewableId);
  // throw new Error('error saving data');
  setNote(note);
  return { success: true };
}
