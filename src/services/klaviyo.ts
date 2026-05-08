/**
 * Klaviyo Service (Plug-and-Play)
 * 
 * To activate this service:
 * 1. Sign up for a Klaviyo account.
 * 2. Create a "Public API Key" (Site ID) in your Klaviyo settings.
 * 3. Create a List for your Waitlist and get the "List ID".
 * 4. Add these to your .env file as VITE_KLAVIYO_COMPANY_ID and VITE_KLAVIYO_LIST_ID.
 */

const KLAVIYO_COMPANY_ID = import.meta.env.VITE_KLAVIYO_COMPANY_ID;
const KLAVIYO_LIST_ID = import.meta.env.VITE_KLAVIYO_LIST_ID;

export interface WaitlistSubmission {
  email: string;
  fullName: string;
  source?: string;
}

export const subscribeToWaitlist = async (data: WaitlistSubmission): Promise<{ success: boolean; message: string }> => {
  // Simulate a network delay for better UX testing
  await new Promise(resolve => setTimeout(resolve, 1000));

  // If no API keys are present, we run in "Mock Mode"
  if (!KLAVIYO_COMPANY_ID || !KLAVIYO_LIST_ID) {
    console.log('--- Klaviyo Mock Mode ---');
    console.log('Data:', data);
    console.log('To activate: Add VITE_KLAVIYO_COMPANY_ID and VITE_KLAVIYO_LIST_ID to your .env');
    return { success: true, message: 'Mock submission successful.' };
  }

  try {
    /**
     * This uses the Klaviyo Client-Side API to add a profile to a list.
     * Note: In a production environment with sensitive data, a server-side 
     * implementation using Private API keys is recommended.
     */
    const response = await fetch(`https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_COMPANY_ID}`, {
      method: 'POST',
      headers: {
        'revision': '2024-02-15',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          type: "subscription",
          attributes: {
            custom_source: data.source || 'Website Waitlist',
            profile: {
              data: {
                type: "profile",
                attributes: {
                  email: data.email,
                  first_name: data.fullName
                }
              }
            }
          },
          relationships: {
            list: {
              data: {
                type: "list",
                id: KLAVIYO_LIST_ID
              }
            }
          }
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Klaviyo subscription failed');
    }

    return { success: true, message: 'Successfully subscribed to waitlist.' };
  } catch (error) {
    console.error('Waitlist Error:', error);
    return { success: false, message: 'There was an error joining the waitlist. Please try again.' };
  }
};
