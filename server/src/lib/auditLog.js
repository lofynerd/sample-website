import AuditLog from '../models/AuditLog.js';

// Computes a shallow field-level diff between the previous and next document
function diffFields(before, after) {
  const changes = [];
  const keys = new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})]);

  for (const key of keys) {
    if (['_id', '__v', 'createdAt', 'updatedAt'].includes(key)) continue;
    const previousValue = before?.[key];
    const newValue = after?.[key];
    if (JSON.stringify(previousValue) !== JSON.stringify(newValue)) {
      changes.push({ field: key, previousValue, newValue });
    }
  }

  return changes;
}

// Records an admin edit/create/delete for traceability. Never throws - logging failures
// should not block the underlying operation.
export async function recordAuditLog({ entityType, entityId, entityLabel, action, before, after, editedBy }) {
  try {
    const changes = action === 'update' ? diffFields(before, after) : [];
    await AuditLog.create({ entityType, entityId, entityLabel, action, changes, editedBy });
  } catch {
    // best-effort only
  }
}
