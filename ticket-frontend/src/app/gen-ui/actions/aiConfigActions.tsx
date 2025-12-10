'use server';

import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

export interface Ticket {
  id: number;
  title: string;
  status: string;
  operation: string;
  requester: string;
}

export interface CardConfig {
  layout: 'grid' | 'list' | 'compact';
  theme: 'blue' | 'green' | 'purple' | 'modern';
  showHeader: boolean;
  showFooter: boolean;
  headerClasses: string;
  bodyClasses: string;
  footerClasses: string;
  containerClasses: string;
  titleClasses: string;
  fields: Array<{
    name: string;
    label: string;
    value: string | number;
    className?: string;
  }>;
  badge?: {
    text: string;
    className: string;
  };
  icon?: string;
}

// Zod schema for AI to generate card configuration
const CardConfigSchema = z.object({
  layout: z.enum(['grid', 'list', 'compact']).describe('Layout type based on number of items and context'),
  theme: z.enum(['blue', 'green', 'purple', 'modern']).describe('Color theme to use'),
  showHeader: z.boolean().describe('Whether to show header section'),
  showFooter: z.boolean().describe('Whether to show footer with AI badge'),
  headerClasses: z.string().describe('Tailwind classes for header'),
  bodyClasses: z.string().describe('Tailwind classes for body'),
  footerClasses: z.string().describe('Tailwind classes for footer'),
  containerClasses: z.string().describe('Tailwind classes for container'),
  titleClasses: z.string().describe('Tailwind classes for title'),
  fields: z.array(z.object({
    name: z.string(),
    label: z.string(),
    value: z.union([z.string(), z.number()]),
    className: z.string().optional()
  })).describe('Fields to display in the card'),
  badge: z.object({
    text: z.string(),
    className: z.string()
  }).optional().describe('Optional badge configuration'),
  icon: z.string().optional().describe('Optional emoji icon')
});

// Generate AI configuration for displaying tickets
async function generateTicketCardConfig(ticketCount: number, userPrompt: string): Promise<CardConfig> {
  try {
    const result = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: CardConfigSchema,
      prompt: `Generate a card configuration for displaying ${ticketCount} tickets in a COMPACT card layout.

User request: "${userPrompt}"

Guidelines:
- ALWAYS use 'grid' layout for any number of tickets (compact cards in grid)
- Use 'modern' theme for consistent dark styling
- showHeader: false (we handle header in component)
- showFooter: true
- IMPORTANT: Include EXACTLY 2 unique fields, NO DUPLICATES:
  1. { name: "operation", label: "Operation", value: "" }
  2. { name: "requester", label: "Requester", value: "" }
- DO NOT repeat or duplicate fields
- icon: Choose ONE appropriate emoji based on ticket type:
  * 🐛 for bugs/fixes
  * ✨ for features
  * 📝 for documentation
  * 🔑 for access/keys/gitlab
  * 📋 for tasks
- Badge should show the status
- Keep containerClasses minimal (component handles styling)
- Make it compact and clean like a dashboard card

Return valid configuration JSON with NO duplicate fields.`,
    });

    return result.object as CardConfig;
  } catch (error) {
    // Fallback configuration if AI fails
    return {
      layout: 'grid',
      theme: 'modern',
      showHeader: false,
      showFooter: true,
      headerClasses: '',
      bodyClasses: 'p-4',
      footerClasses: 'px-4 py-2.5 bg-gray-900/40 border-t border-gray-700/50 text-gray-500',
      containerClasses: 'bg-gray-800/40 rounded-xl border border-gray-700/50',
      titleClasses: 'text-lg font-bold text-white mb-4',
      fields: [
        { name: 'operation', label: 'Operation', value: '' },
        { name: 'requester', label: 'Requester', value: '' }
      ],
      badge: {
        text: 'Open',
        className: 'px-2.5 py-1 rounded-md text-xs font-semibold'
      },
      icon: '📌'
    };
  }
}

// Server action: Get tickets with AI-configured UI
export async function getTicketsWithAIConfig(userPrompt: string = "show all tickets"): Promise<{
  tickets: Ticket[];
  config: CardConfig;
  error?: string;
}> {
  try {
    // Fetch tickets from backend
    const response = await fetch('http://localhost:8000/tickets', {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }

    const tickets: Ticket[] = await response.json();

    // Generate AI configuration
    const config = await generateTicketCardConfig(tickets.length, userPrompt);

    // Populate config fields with actual ticket data
    const populatedConfig = {
      ...config,
      fields: config.fields.map(field => ({
        ...field,
        value: '' // Will be populated on client with actual ticket data
      }))
    };

    return {
      tickets,
      config: populatedConfig
    };
  } catch (error) {
    return {
      tickets: [],
      config: {} as CardConfig,
      error: String(error)
    };
  }
}

// Server action: Create ticket with AI-configured success UI
export async function createTicketWithAIConfig(
  title: string,
  status: string,
  operation: string,
  requester: string
): Promise<{
  ticket?: Ticket;
  successConfig?: {
    theme: 'green' | 'blue' | 'purple';
    message: string;
  };
  error?: string;
}> {
  try {
    const response = await fetch('http://localhost:8000/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, status, operation, requester }),
    });

    if (!response.ok) {
      throw new Error('Failed to create ticket');
    }

    const ticket: Ticket = await response.json();

    // AI generates success screen configuration
    const successConfig = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        theme: z.enum(['green', 'blue', 'purple']),
        message: z.string().describe('Success message to show user'),
      }),
      prompt: `A ticket was just created successfully with title: "${title}".
Generate a configuration for a success screen. Make it celebratory and positive.`,
    });

    return {
      ticket,
      successConfig: successConfig.object
    };
  } catch (error) {
    return {
      error: String(error)
    };
  }
}
