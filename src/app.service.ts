import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private dataSource: DataSource) {}

  async getCustomers() {
    const sql = `
      SELECT
        c.id,
        c.first_name,
        c.last_name,
        c.segment,
        CASE WHEN s.encrypted_national_id IS NOT NULL THEN true ELSE false END as has_secret,
        (
          SELECT performed_at
          FROM audit_logs a
          WHERE a.customer_id = c.id
          ORDER BY performed_at DESC
          LIMIT 1
        ) as last_accessed_at
      FROM customers c
      LEFT JOIN customer_secrets s ON c.id = s.customer_id;
    `;

    return this.dataSource.query(sql);
  }

  async getNationalId(customer_id: number) {

    const result = await this.dataSource.query(
      `SELECT encrypted_national_id FROM customer_secrets WHERE customer_id = $1`,
      [customer_id],
    );

    if (result.length === 0) return {error: 'No data found'};

    const encryptedData = result[0].encrypted_national_id;


    const realNationalId = encryptedData.includes('dummy')
    ? '1-1004-99999-99-9'
    : 'UNKNOWN-DATA';

    await this.dataSource.query(
      `INSERT INTO audit_logs (customer_id, action_type) VALUES ($1, 'VIEW_SECRET')` , [customer_id]
    );

    return { national_id: realNationalId};
  }
}
