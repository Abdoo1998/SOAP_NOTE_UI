interface ParsedSoap {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export const parseSoapNote = (content: string): ParsedSoap => {
  const sections: ParsedSoap = {
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  };

  // Split content into lines and remove empty lines
  const lines = content.split('\n').filter(line => line.trim());
  let currentSection: keyof ParsedSoap | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for section headers with ##
    if (line.toLowerCase().startsWith('## subjective')) {
      currentSection = 'subjective';
      continue;
    } else if (line.toLowerCase().startsWith('## objective')) {
      currentSection = 'objective';
      continue;
    } else if (line.toLowerCase().startsWith('## assessment')) {
      currentSection = 'assessment';
      continue;
    } else if (line.toLowerCase().startsWith('## plan')) {
      currentSection = 'plan';
      continue;
    }

    // Add content to current section if we're in one
    if (currentSection) {
      // Add the line with proper spacing
      sections[currentSection] += (sections[currentSection] ? '\n' : '') + line;
    }
  }

  return sections;
};