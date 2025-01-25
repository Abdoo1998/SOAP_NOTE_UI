interface LoginResponse {
  access_token: string;
  token_type: string;
  username: string;
  job: string;
}

export const formatLoginResponse = (response: any): LoginResponse => {
  // Ensure all required fields are present
  if (!response?.access_token) {
    throw new Error('Invalid response: missing access token');
  }

  // Format the response according to requirements
  return {
    access_token: response.access_token,
    token_type: 'bearer', // Always lowercase 'bearer'
    username: formatUsername(response.username || ''),
    job: response.job || ''
  };
};

// Helper function to properly format username
const formatUsername = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};