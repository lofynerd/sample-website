import mongoose from '../lib/db.js';

// Records a single field change made by an admin, for traceability on edits/deletes
const auditLogSchema = new mongoose.Schema(
  {
    entityType: { type: String, required: true, enum: ['product', 'article', 'order'], index: true },
    entityId: { type: String, required: true, index: true },
    entityLabel: { type: String }, // human-readable name/title/orderId at time of change
    action: { type: String, required: true, enum: ['create', 'update', 'delete'] },
    changes: {
      type: [{ field: String, previousValue: mongoose.Schema.Types.Mixed, newValue: mongoose.Schema.Types.Mixed }],
      default: [],
    },
    editedBy: { type: String, required: true }, // admin username
  },
  { collection: 'audit_logs', timestamps: true }
);

export default mongoose.model('AuditLog', auditLogSchema);
