interface ClickUpTask {
  name: string;
  description: string;
  status: string;
  priority: number;
  assignees?: number[];
  tags?: string[];
  custom_fields?: Array<{
    id: string;
    value: string | number;
  }>;
}

interface ContactFormData {
  name: string;
  email: string;
  projectAssistance: string;
  telegram?: string;
  xTwitter?: string;
  discord?: string;
  contactPreference: 'email' | 'telegram' | 'x' | 'discord';
}

export async function createClickUpTask(
  contactData: ContactFormData,
  listId: string = '901609020437' // BUSINESS REQUESTS list in NODEIFI DAO space
): Promise<boolean> {
  if (!process.env.CLICKUP_API_KEY) {
    console.error('ClickUp API key not provided');
    return false;
  }

  const taskData: ClickUpTask = {
    name: contactData.email,
    description: `
**Contact Information:**
- Name: ${contactData.name}
- Email: ${contactData.email}
${contactData.telegram ? `- Telegram: ${contactData.telegram}` : ''}
${contactData.xTwitter ? `- X (Twitter): ${contactData.xTwitter}` : ''}
${contactData.discord ? `- Discord: ${contactData.discord}` : ''}

**Preferred Contact Method:** ${contactData.contactPreference}

**Project Assistance Requested:**
${contactData.projectAssistance}

**Submitted:** ${new Date().toISOString()}
    `.trim(),
    status: 'unprocessed',
    priority: 3, // High priority for new leads
    tags: ['lead', 'contact-form', 'website']
  };

  try {
    const response = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.CLICKUP_API_KEY
      },
      body: JSON.stringify(taskData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ClickUp API error:', response.status, errorText);
      return false;
    }

    const result = await response.json();
    console.log('ClickUp task created successfully:', result.id);
    return true;
  } catch (error) {
    console.error('Error creating ClickUp task:', error);
    return false;
  }
}

export async function getClickUpWorkspaces(): Promise<any[]> {
  if (!process.env.CLICKUP_API_KEY) {
    throw new Error('ClickUp API key not provided');
  }

  try {
    const response = await fetch('https://api.clickup.com/api/v2/team', {
      headers: {
        'Authorization': process.env.CLICKUP_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`ClickUp API error: ${response.status}`);
    }

    const result = await response.json();
    return result.teams || [];
  } catch (error) {
    console.error('Error fetching ClickUp workspaces:', error);
    throw error;
  }
}

export async function getClickUpLists(spaceId: string): Promise<any[]> {
  if (!process.env.CLICKUP_API_KEY) {
    throw new Error('ClickUp API key not provided');
  }

  try {
    const response = await fetch(`https://api.clickup.com/api/v2/space/${spaceId}/list`, {
      headers: {
        'Authorization': process.env.CLICKUP_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`ClickUp API error: ${response.status}`);
    }

    const result = await response.json();
    return result.lists || [];
  } catch (error) {
    console.error('Error fetching ClickUp lists:', error);
    throw error;
  }
}