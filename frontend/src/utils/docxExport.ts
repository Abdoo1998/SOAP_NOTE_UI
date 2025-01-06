import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  AlignmentType,
  Header,
  Footer,
  PageNumber,
  SectionType,
  PageOrientation,
  convertInchesToTwip,
  ITableBordersOptions
} from 'docx';
import { saveAs } from 'file-saver';
import { PatientInfo } from '../types/patient';
import { parseSoapNote } from './soapParser';

const tableBorders: ITableBordersOptions = {
  top: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
  left: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
  right: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
  insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "999999" }
};

export const exportToWord = async (
  content: string,
  patientInfo: PatientInfo,
  timestamp: Date
) => {
  const sections = parseSoapNote(content);
  
  const doc = new Document({
    sections: [{
      properties: {
        type: SectionType.CONTINUOUS,
        page: {
          margin: {
            top: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1)
          },
          orientation: PageOrientation.PORTRAIT
        }
      },
      headers: {
        default: new Header({
          children: [
            new Table({
              width: { size: 100, type: "pct" },
              borders: tableBorders,
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "SOAP Note Documentation",
                              bold: true,
                              size: 28,
                              font: "Arial",
                            })
                          ],
                          alignment: AlignmentType.CENTER
                        })
                      ],
                      borders: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "999999" } }
                    })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `Generated: ${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`,
                              size: 20,
                              font: "Arial",
                            })
                          ],
                          alignment: AlignmentType.RIGHT
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Table({
              width: { size: 100, type: "pct" },
              borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "999999" } },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Page ",
                              size: 20,
                              font: "Arial"
                            }),
                            new TextRun({
                              children: [PageNumber.CURRENT],
                              size: 20,
                              font: "Arial"
                            }),
                            new TextRun({
                              text: " of ",
                              size: 20,
                              font: "Arial"
                            }),
                            new TextRun({
                              children: [PageNumber.TOTAL_PAGES],
                              size: 20,
                              font: "Arial"
                            })
                          ],
                          alignment: AlignmentType.CENTER
                        })
                      ],
                      borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "999999" } }
                    })
                  ]
                })
              ]
            })
          ]
        })
      },
      children: [
        // Patient Information Table
        new Table({
          width: { size: 100, type: "pct" },
          borders: tableBorders,
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "Patient Information",
                          bold: true,
                          size: 24,
                          font: "Arial",
                        })
                      ],
                      alignment: AlignmentType.CENTER
                    })
                  ],
                  columnSpan: 2,
                  shading: { fill: "F4F4F4" }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [createLabelValuePair("Patient Name:", patientInfo.name)]
                }),
                new TableCell({
                  children: [createLabelValuePair("Patient ID:", patientInfo.id)]
                })
              ]
            })
          ]
        }),

        new Paragraph({ spacing: { after: 400 } }),

        // SOAP Note Sections
        ...createSectionWithBox("Subjective", sections.subjective, "2B579A"),
        ...createSectionWithBox("Objective", sections.objective, "217346"),
        ...createSectionWithBox("Assessment", sections.assessment, "C55A11"),
        ...createSectionWithBox("Differential Diagnosis", sections.differentialDiagnosis, "7030A0"),
        ...createSectionWithBox("Plan", sections.plan, "00B0F0"),
        ...createSectionWithBox("Conclusion", sections.conclusion, "00B050")
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `SOAP_Note_${patientInfo.name}_${timestamp.toISOString().split('T')[0]}.docx`;
  saveAs(blob, fileName);
};

const createLabelValuePair = (label: string, value: string) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: label,
        bold: true,
        size: 22,
        font: "Arial",
      }),
      new TextRun({
        text: " " + value,
        size: 22,
        font: "Arial",
      })
    ],
    spacing: { before: 120, after: 120 }
  });
};

const createSectionWithBox = (title: string, content: string, color: string) => {
  return [
    new Table({
      width: { size: 100, type: "pct" },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 3, color: color },
        bottom: { style: BorderStyle.SINGLE, size: 3, color: color },
        left: { style: BorderStyle.SINGLE, size: 3, color: color },
        right: { style: BorderStyle.SINGLE, size: 3, color: color }
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: title,
                      bold: true,
                      size: 28,
                      font: "Arial",
                      color: color
                    })
                  ],
                  spacing: { before: 200, after: 200 }
                }),
                ...content.split('\n').map(line => 
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: line,
                        size: 24,
                        font: "Arial"
                      })
                    ],
                    spacing: { before: 120, after: 120 }
                  })
                )
              ],
              margins: {
                top: 200,
                bottom: 200,
                left: 400,
                right: 400
              }
            })
          ]
        })
      ]
    }),
    new Paragraph({ spacing: { after: 400 } })
  ];
};