// College-mandated predefined pages for SDJ International College, Vesu

let _id = 0;
function uid() {
  return Date.now() + (++_id) + Math.random();
}

export function createCoverPage() {
  return {
    id: uid(),
    noHeaderFooter: true,
    sections: [
      {
        id: uid(),
        type: 'template-cover',
        content: 'Cover Page',
        projectTitle: '',
        students: [
          { rollNo: '', seatNo: '', name: '' },
          { rollNo: '', seatNo: '', name: '' },
          { rollNo: '', seatNo: '', name: '' },
          { rollNo: '', seatNo: '', name: '' },
        ],
        guideName: '',
      },
    ],
  };
}

export function createAcknowledgementPage() {
  return {
    id: uid(),
    noHeaderFooter: true,
    sections: [
      {
        id: uid(),
        type: 'template-acknowledgement',
        content: 'Acknowledgement',
        guideName: '',
        students: [
          'Student Name (Exam Seat Number)',
          'Student Name (Exam Seat Number)',
          'Student Name (Exam Seat Number)',
          'Student Name (Exam Seat Number)',
        ],
      },
    ],
  };
}

export function createIndexPage() {
  return {
    id: uid(),
    noHeaderFooter: true,
    sections: [
      {
        id: uid(),
        type: 'title',
        content: 'I N D E X',
        align: 'center',
      },
      {
        id: uid(),
        type: 'table',
        content: 'Index Table',
        align: 'justify',
        compact: true,
        tableData: [
          [{ text: 'Sr. No', bold: true }, { text: 'Description', bold: true }, { text: 'Page No.', bold: true }],
          [{ text: '1', bold: true }, { text: 'Introduction', bold: true }, { text: '', bold: false }],
          [{ text: '', bold: false }, { text: '1.1 Project Description', bold: false }, { text: '', bold: false }],
          [{ text: '', bold: false }, { text: '1.2 Project Profile', bold: false }, { text: '', bold: false }],
          [{ text: '2', bold: true }, { text: 'Environment Description', bold: true }, { text: '', bold: false }],
          [{ text: '', bold: false }, { text: '2.1 Hardware and Software Requirements', bold: false }, { text: '', bold: false }],
          [{ text: '', bold: false }, { text: '2.2 Technologies Used', bold: false }, { text: '', bold: false }],
          [{ text: '3', bold: true }, { text: 'System Analysis and Planning', bold: true }, { text: '', bold: false }],
          [{ text: '', bold: false }, { text: '3.1 Existing System and its Drawbacks', bold: false }, { text: '', bold: false }],
          [{ text: '', bold: false }, { text: '3.2 Feasibility Study', bold: false }, { text: '', bold: false }],
          [{ text: '', bold: false }, { text: '3.3 Requirement Gathering and Analysis', bold: false }, { text: '', bold: false }],
          [{ text: '4', bold: true }, { text: 'Proposed System', bold: true }, { text: '', bold: false }],
          [{ text: '', bold: false }, { text: '4.1 Scope', bold: false }, { text: '', bold: false }],
          [{ text: '', bold: false }, { text: '4.2 Project Modules Functionalities', bold: false }, { text: '', bold: false }],
          [{ text: '5', bold: true }, { text: 'Detail Planning', bold: true }, { text: '', bold: false }],
          [{ text: '', bold: false }, { text: '5.1 Data Flow Diagram / UML', bold: false }, { text: '', bold: false }],
          [{ text: '', bold: false }, { text: '5.2 Data Dictionary', bold: false }, { text: '', bold: false }],
          [{ text: '', bold: false }, { text: '5.3 Process Specification / Activity Flow Diagram', bold: false }, { text: '', bold: false }],
          [{ text: '', bold: false }, { text: '5.4 Entity-Relationship Diagram / Class Diagram', bold: false }, { text: '', bold: false }],
          [{ text: '6', bold: true }, { text: 'System Design', bold: true }, { text: '', bold: false }],
          [{ text: '', bold: false }, { text: '6.1 Database Design', bold: false }, { text: '', bold: false }],
          [{ text: '', bold: false }, { text: '6.2 Input Design', bold: false }, { text: '', bold: false }],
          [{ text: '', bold: false }, { text: '6.3 Output Design', bold: false }, { text: '', bold: false }],
          [{ text: '7', bold: true }, { text: 'Software Testing', bold: true }, { text: '', bold: false }],
          [{ text: '', bold: false }, { text: '7.1 Unit Testing', bold: false }, { text: '', bold: false }],
          [{ text: '', bold: false }, { text: '7.2 Integration Testing', bold: false }, { text: '', bold: false }],
          [{ text: '', bold: false }, { text: '7.3 System Testing', bold: false }, { text: '', bold: false }],
          [{ text: '8', bold: true }, { text: 'Future Scope of Enhancements', bold: true }, { text: '', bold: false }],
          [{ text: '9', bold: true }, { text: 'Bibliography & Reference', bold: true }, { text: '', bold: false }],
        ],
      },
    ],
  };
}
