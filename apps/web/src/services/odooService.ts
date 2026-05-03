// Odoo API Integration Service
// Base URL: https://tamvonline-oficial.odoo.com

const ODOO_BASE_URL = import.meta.env.VITE_ODOO_BASE_URL || 'https://tamvonline-oficial.odoo.com';
const ODOO_DB = import.meta.env.VITE_ODOO_DB || 'tamvonline';
const ODOO_USERNAME = import.meta.env.VITE_ODOO_USERNAME;
const ODOO_API_KEY = import.meta.env.VITE_ODOO_API_KEY;

interface OdooAuthResponse {
  success: boolean;
  uid?: number;
  session_id?: string;
  error?: string;
}

interface OdooResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class OdooService {
  private sessionId: string | null = null;
  private uid: number | null = null;

  /**
   * Authenticate with Odoo
   */
  async authenticate(): Promise<OdooAuthResponse> {
    if (!ODOO_USERNAME || !ODOO_API_KEY) {
      console.warn('Odoo credentials not configured');
      return { success: false, error: 'Odoo credentials not configured' };
    }

    try {
      const response = await fetch(`${ODOO_BASE_URL}/web/session/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {
            db: ODOO_DB,
            login: ODOO_USERNAME,
            password: ODOO_API_KEY,
          },
        }),
      });

      const data = await response.json();
      
      if (data.result && data.result.uid) {
        this.uid = data.result.uid;
        this.sessionId = response.headers.get('set-cookie') || undefined;
        return {
          success: true,
          uid: data.result.uid,
          session_id: this.sessionId,
        };
      }

      return { success: false, error: 'Authentication failed' };
    } catch (error) {
      console.error('Odoo authentication error:', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * Execute Odoo RPC method
   */
  async callMethod<T>(
    model: string,
    method: string,
    args: any[] = [],
    kwargs: Record<string, any> = {}
  ): Promise<OdooResponse<T>> {
    if (!this.uid) {
      const auth = await this.authenticate();
      if (!auth.success) {
        return { success: false, error: 'Not authenticated' };
      }
    }

    try {
      const response = await fetch(`${ODOO_BASE_URL}/web/dataset/call_kw/${model}/${method}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.sessionId ? { 'Cookie': this.sessionId } : {}),
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {
            model,
            method,
            args,
            kwargs,
          },
        }),
      });

      const data = await response.json();

      if (data.result !== undefined) {
        return { success: true, data: data.result };
      }

      return { success: false, error: 'Unknown error' };
    } catch (error) {
      console.error('Odoo RPC error:', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * Get TAMV Members from Odoo
   */
  async getMembers(): Promise<OdooResponse<any[]>> {
    return this.callMethod<any[]>('res.partner', 'search_read', [], {
      fields: ['id', 'name', 'email', 'phone', 'x_tamv_member_type'],
      limit: 100,
    });
  }

  /**
   * Get TAMV Subscriptions
   */
  async getSubscriptions(): Promise<OdooResponse<any[]>> {
    return this.callMethod<any[]>('sale.subscription', 'search_read', [], {
      fields: ['id', 'name', 'partner_id', 'state', 'recurring_next_date', 'x_tamv_plan'],
      limit: 100,
    });
  }

  /**
   * Create new member in Odoo
   */
  async createMember(memberData: {
    name: string;
    email: string;
    phone?: string;
    x_tamv_member_type?: string;
  }): Promise<OdooResponse<number>> {
    return this.callMethod<number>('res.partner', 'create', [memberData], {});
  }

  /**
   * Get Orders
   */
  async getOrders(): Promise<OdooResponse<any[]>> {
    return this.callMethod<any[]>('sale.order', 'search_read', [], {
      fields: ['id', 'name', 'partner_id', 'state', 'date_order', 'amount_total'],
      limit: 100,
    });
  }

  /**
   * Check connection status
   */
  async ping(): Promise<boolean> {
    try {
      const response = await fetch(`${ODOO_BASE_URL}/web/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    this.uid = null;
    this.sessionId = null;
  }
}

export const odooService = new OdooService();
export default odooService;
