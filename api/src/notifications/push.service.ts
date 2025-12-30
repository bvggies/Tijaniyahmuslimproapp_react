import { Injectable, Logger } from '@nestjs/common';

interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: 'default' | null;
  badge?: number;
  channelId?: string;
  priority?: 'default' | 'normal' | 'high';
  ttl?: number;
}

interface ExpoPushTicket {
  id?: string;
  status: 'ok' | 'error';
  message?: string;
  details?: {
    error?: string;
  };
}

interface PushResult {
  token: string;
  success: boolean;
  ticketId?: string;
  error?: string;
}

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);
  private readonly EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
  private readonly MAX_BATCH_SIZE = 100;

  /**
   * Send a push notification to a single device
   */
  async sendPushNotification(params: {
    expoPushToken: string;
    title: string;
    body: string;
    data?: Record<string, any>;
    badge?: number;
  }): Promise<PushResult> {
    const results = await this.sendPushNotifications([params]);
    return results[0];
  }

  /**
   * Send push notifications to multiple devices (batched)
   */
  async sendPushNotifications(
    notifications: Array<{
      expoPushToken: string;
      title: string;
      body: string;
      data?: Record<string, any>;
      badge?: number;
    }>,
  ): Promise<PushResult[]> {
    if (notifications.length === 0) {
      return [];
    }

    // Validate tokens and prepare messages
    const messages: ExpoPushMessage[] = notifications
      .filter((n) => this.isValidExpoToken(n.expoPushToken))
      .map((n) => ({
        to: n.expoPushToken,
        title: n.title,
        body: n.body,
        data: n.data || {},
        sound: 'default' as const,
        badge: n.badge,
        priority: 'high' as const,
        channelId: 'default',
      }));

    if (messages.length === 0) {
      this.logger.warn('No valid Expo push tokens to send');
      return notifications.map((n) => ({
        token: n.expoPushToken,
        success: false,
        error: 'Invalid Expo push token format',
      }));
    }

    // Send in batches
    const results: PushResult[] = [];
    const batches = this.chunkArray(messages, this.MAX_BATCH_SIZE);

    for (const batch of batches) {
      const batchResults = await this.sendBatch(batch);
      results.push(...batchResults);
    }

    // Map results back to original tokens
    const tokenResultMap = new Map(results.map((r) => [r.token, r]));
    return notifications.map((n) => {
      const result = tokenResultMap.get(n.expoPushToken);
      if (result) return result;
      return {
        token: n.expoPushToken,
        success: false,
        error: 'Token not processed',
      };
    });
  }

  /**
   * Send a batch of messages to Expo Push API
   */
  private async sendBatch(messages: ExpoPushMessage[]): Promise<PushResult[]> {
    try {
      this.logger.log(`Sending batch of ${messages.length} push notifications`);

      const response = await fetch(this.EXPO_PUSH_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Expo Push API error: ${response.status} - ${errorText}`);
        return messages.map((m) => ({
          token: m.to,
          success: false,
          error: `HTTP ${response.status}: ${errorText}`,
        }));
      }

      const responseData = await response.json();
      const tickets: ExpoPushTicket[] = responseData.data || [];

      return messages.map((m, i) => {
        const ticket = tickets[i];
        if (!ticket) {
          return {
            token: m.to,
            success: false,
            error: 'No ticket returned',
          };
        }

        if (ticket.status === 'ok') {
          return {
            token: m.to,
            success: true,
            ticketId: ticket.id,
          };
        }

        // Handle error
        const error = ticket.details?.error || ticket.message || 'Unknown error';
        this.logger.warn(`Push failed for token ${m.to}: ${error}`);
        return {
          token: m.to,
          success: false,
          error,
        };
      });
    } catch (error) {
      this.logger.error('Failed to send push batch:', error);
      return messages.map((m) => ({
        token: m.to,
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      }));
    }
  }

  /**
   * Validate Expo push token format
   */
  private isValidExpoToken(token: string): boolean {
    return token.startsWith('ExponentPushToken[') || token.startsWith('ExpoPushToken[');
  }

  /**
   * Split array into chunks
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Check receipts for push notifications (for debugging/monitoring)
   */
  async checkReceipts(ticketIds: string[]): Promise<Record<string, any>> {
    if (ticketIds.length === 0) return {};

    try {
      const response = await fetch('https://exp.host/--/api/v2/push/getReceipts', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: ticketIds }),
      });

      if (!response.ok) {
        this.logger.error(`Failed to check receipts: ${response.status}`);
        return {};
      }

      const data = await response.json();
      return data.data || {};
    } catch (error) {
      this.logger.error('Error checking receipts:', error);
      return {};
    }
  }
}

