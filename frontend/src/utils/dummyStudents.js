export const generateDummyStudents = (classId) => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `${classId}-STU-${i + 1}`,
    rollNo: i + 1,
    name: `Student ${i + 1}`,
    email: `student${i + 1}@example.com`,
    attendance: Math.floor(Math.random() * 20) + 80,
  }));
};