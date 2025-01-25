interface ParsedSoap {
  subjective: string;
  objective: string;
  assessment: string;
  differentialDiagnosis: string;
  plan: string;
  conclusion: string;
}

export const parseSoapNote = (content: string): ParsedSoap => {
  const sections: ParsedSoap = {
    subjective: '',
    objective: '',
    assessment: '',
    differentialDiagnosis: '',
    plan: '',
    conclusion: ''
  };

  // Return empty sections if no content
  if (!content || typeof content !== 'string') {
    return sections;
  }

  // Split content into lines
  const lines = content.split('\n');
  let currentSection: keyof ParsedSoap | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check for section headers
    if (trimmedLine.toLowerCase().startsWith('## subjective')) {
      currentSection = 'subjective';
      continue;
    } else if (trimmedLine.toLowerCase().startsWith('## objective')) {
      currentSection = 'objective';
      continue;
    } else if (trimmedLine.toLowerCase().startsWith('## assessment')) {
      currentSection = 'assessment';
      continue;
    } else if (trimmedLine.toLowerCase().startsWith('## differential diagnosis')) {
      currentSection = 'differentialDiagnosis';
      continue;
    } else if (trimmedLine.toLowerCase().startsWith('## plan')) {
      currentSection = 'plan';
      continue;
    } else if (trimmedLine.toLowerCase().startsWith('## conclusion')) {
      currentSection = 'conclusion';
      continue;
    }

    // Add content to current section
    if (currentSection && trimmedLine) {
      sections[currentSection] = sections[currentSection]
        ? `${sections[currentSection]}\n${trimmedLine}`
        : trimmedLine;
    }
  }

  return sections;
};