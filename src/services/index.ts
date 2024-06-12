import { Empire } from '../types';

type SendMessageToKingdomResponse = {
  index: number;
  message: {
    role: string;
    content: string;
  };
  logprobs: null | any;
  finish_reason: string;
};

export const sendMessageToKingdom = async (empire: Empire, message: string) => {
  try {
    const response = await fetch(
      import.meta.env.VITE_AWS_API_URL + '/dialogue',
      {
        method: 'POST',
        body: JSON.stringify({
          message: message,
          empire: empire,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const responseBody: SendMessageToKingdomResponse = await response.json();
      return responseBody;
    } else {
      console.error(
        'Error sending message to kingdom. Status: ',
        response.status
      );
      return 'error';
    }
  } catch (error) {
    console.error('Error sending message to kingdom.');
    return 'error';
  }
};
