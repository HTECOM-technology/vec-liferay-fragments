package vn.vec.custom.admin.networkpolicy.util;

import vn.vec.custom.admin.networkpolicy.model.AdminNetworkType;

public class IPv4NetworkUtil {

	public static boolean contains(String networkAddress, String clientIp) {
		Network network = parse(networkAddress);

		if ((network == null) || !isValidSingleIp(clientIp)) {
			return false;
		}

		long clientValue = toLong(clientIp);
		long mask = mask(network.prefixLength);

		return (clientValue & mask) == (network.networkValue & mask);
	}

	public static String detectNetworkType(String networkAddress) {
		if (isValidSingleIp(networkAddress)) {
			return AdminNetworkType.SINGLE_IP;
		}

		if (isValidCidr(networkAddress)) {
			return AdminNetworkType.CIDR;
		}

		return null;
	}

	public static boolean isValidCidr(String value) {
		return parse(value) != null;
	}

	public static boolean isValidNetworkAddress(String value) {
		return detectNetworkType(value) != null;
	}

	public static boolean isValidSingleIp(String value) {
		if ((value == null) || value.trim().isEmpty() || value.contains("/")) {
			return false;
		}

		String[] parts = value.trim().split("\\.", -1);

		if (parts.length != 4) {
			return false;
		}

		for (String part : parts) {
			if (!_isValidOctet(part)) {
				return false;
			}
		}

		return true;
	}

	public static String normalize(String value) {
		if (value == null) {
			return "";
		}

		String trimmedValue = value.trim();

		if (isValidSingleIp(trimmedValue)) {
			return trimmedValue;
		}

		Network network = parse(trimmedValue);

		if (network == null) {
			return trimmedValue;
		}

		return toIpAddress(network.networkValue) + "/" + network.prefixLength;
	}

	public static Network parse(String value) {
		if ((value == null) || value.trim().isEmpty()) {
			return null;
		}

		String trimmedValue = value.trim();

		if (!trimmedValue.contains("/")) {
			if (!isValidSingleIp(trimmedValue)) {
				return null;
			}

			return new Network(toLong(trimmedValue), 32);
		}

		String[] parts = trimmedValue.split("/", -1);

		if (parts.length != 2) {
			return null;
		}

		if (!isValidSingleIp(parts[0])) {
			return null;
		}

		int prefixLength;

		try {
			prefixLength = Integer.parseInt(parts[1]);
		}
		catch (NumberFormatException numberFormatException) {
			return null;
		}

		if ((prefixLength < 0) || (prefixLength > 32)) {
			return null;
		}

		long mask = mask(prefixLength);
		long ipValue = toLong(parts[0]);

		return new Network(ipValue & mask, prefixLength);
	}

	public static long toLong(String ipAddress) {
		String[] parts = ipAddress.trim().split("\\.", -1);
		long value = 0;

		for (String part : parts) {
			value = (value << 8) + Integer.parseInt(part);
		}

		return value & 0xffffffffL;
	}

	public static String toIpAddress(long value) {
		return ((value >> 24) & 0xff) + "." +
			((value >> 16) & 0xff) + "." +
			((value >> 8) & 0xff) + "." +
			(value & 0xff);
	}

	public static class Network {

		public Network(long networkValue, int prefixLength) {
			this.networkValue = networkValue;
			this.prefixLength = prefixLength;
		}

		public final long networkValue;
		public final int prefixLength;

	}

	private static boolean _isValidOctet(String part) {
		if ((part == null) || part.isEmpty()) {
			return false;
		}

		if ((part.length() > 1) && part.startsWith("0")) {
			return false;
		}

		for (int i = 0; i < part.length(); i++) {
			if (!Character.isDigit(part.charAt(i))) {
				return false;
			}
		}

		try {
			int value = Integer.parseInt(part);

			return (value >= 0) && (value <= 255);
		}
		catch (NumberFormatException numberFormatException) {
			return false;
		}
	}

	private static long mask(int prefixLength) {
		if (prefixLength == 0) {
			return 0;
		}

		return (0xffffffffL << (32 - prefixLength)) & 0xffffffffL;
	}

	private IPv4NetworkUtil() {
	}

}
