package vn.vec.custom.admin.HookTollReconciliation.model;

import java.math.BigDecimal;

import java.time.LocalDate;
import java.time.OffsetDateTime;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Payload đã parse và validate. OffsetDateTime được chuyển thành UTC khi bind
 * vào cột DATETIME; tầng hiển thị có trách nhiệm đổi về múi giờ +07:00.
 */
public class HookPayload {

	public BigDecimal getDecimal(String name) {
		return (BigDecimal)_values.get(name);
	}

	public Integer getInteger(String name) {
		return (Integer)_values.get(name);
	}

	public LocalDate getLocalDate(String name) {
		return (LocalDate)_values.get(name);
	}

	public OffsetDateTime getOffsetDateTime(String name) {
		return (OffsetDateTime)_values.get(name);
	}

	public String getString(String name) {
		return (String)_values.get(name);
	}

	public Map<String, Object> getValues() {
		return Collections.unmodifiableMap(_values);
	}

	public void put(String name, Object value) {
		_values.put(name, value);
	}

	private final Map<String, Object> _values = new LinkedHashMap<>();
}
