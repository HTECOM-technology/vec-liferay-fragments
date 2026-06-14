package vn.vec.custom.admin.audit.util;

import java.util.HashSet;
import java.util.Set;

import vn.vec.custom.admin.audit.model.AuditActionType;

public class AuditThreadLocal {

	public static void clear() {
		_keys.remove();
	}

	public static boolean consumeHandled(
		String className, String classPK, AuditActionType auditActionType) {

		Set<String> keys = _keys.get();
		String key = _toKey(className, classPK, auditActionType);

		if (!keys.contains(key)) {
			return false;
		}

		keys.remove(key);

		return true;
	}

	public static void markHandled(
		String className, String classPK, AuditActionType auditActionType) {

		_keys.get().add(_toKey(className, classPK, auditActionType));
	}

	private static String _toKey(
		String className, String classPK, AuditActionType auditActionType) {

		return String.valueOf(className) + "#" + String.valueOf(classPK) + "#" +
			String.valueOf(auditActionType);
	}

	public static boolean isPermissionAuditSuppressed() {
		return Boolean.TRUE.equals(_suppressPermission.get());
	}

	public static void restorePermissionAudit() {
		_suppressPermission.remove();
	}

	public static void suppressPermissionAudit() {
		_suppressPermission.set(Boolean.TRUE);
	}

	private static final ThreadLocal<Set<String>> _keys =
		ThreadLocal.withInitial(HashSet::new);

	private static final ThreadLocal<Boolean> _suppressPermission =
		new ThreadLocal<>();

}
