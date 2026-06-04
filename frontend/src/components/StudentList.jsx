

function StudentList({ students }) {
  return (
    <div className="student-list">
      <h3>Students ({students.length})</h3>

      <table>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Attendance</th>
          </tr>
        </thead>

        <tbody>
          {students.map((stu) => (
            <tr key={stu.id}>
              <td>{stu.rollNo}</td>
              <td>{stu.name}</td>
              <td>{stu.email}</td>
              <td>{stu.attendance}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;