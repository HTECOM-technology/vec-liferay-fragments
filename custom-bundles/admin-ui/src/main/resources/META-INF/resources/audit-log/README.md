# Audit Log MVP

Module nay cung cap MVP Audit Log cho `custom-bundles/admin-ui`.

## SQL can apply

Apply file:

```text
custom-bundles/admin-ui/sql/audit-log.sql
```

Neu chua apply SQL, wrapper van tiep tuc nghiep vu goc, nhung audit co the khong ghi duoc vao DB.

## UI endpoint

```text
/o/vec-custom-admin-ui/audit-log/index.html
```

## REST endpoints

```text
GET  /o/vec-admin/audit-logs
GET  /o/vec-admin/audit-logs/{auditLogId}
POST /o/vec-admin/audit-logs/client-event
```

## Enabled wrappers

- `JournalArticleAuditServiceWrapper`
- `JournalFolderAuditServiceWrapper`
- `LayoutAuditServiceWrapper`
- `FragmentEntryLinkAuditServiceWrapper`
- `FragmentEntryAuditServiceWrapper`

## Enabled listeners

- `JournalArticleAuditModelListener`
- `LayoutAuditModelListener`
- `FragmentEntryLinkAuditModelListener`

## Not fully covered yet

- Direct DB changes
- Config files loaded before portal startup
- Runtime changes that bypass Liferay local services
- Generic configuration listener is scaffolded but not registered globally by default

## Notes

- Audit uu tien backend wrapper truoc khi ghi xuong service goc.
- Sensitive keys nhu `password`, `token`, `secret`, `authorization`, `cookie` duoc mask truoc khi luu.
- Module nay khong sua source goc Liferay.
