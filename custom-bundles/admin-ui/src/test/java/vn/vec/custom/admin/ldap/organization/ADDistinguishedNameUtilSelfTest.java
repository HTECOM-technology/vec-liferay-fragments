package vn.vec.custom.admin.ldap.organization;

import java.util.Arrays;
import java.util.List;

public class ADDistinguishedNameUtilSelfTest {

	public static void main(String[] args) throws Exception {
		List<String> organizationNames =
			ADDistinguishedNameUtil.toOrganizationNames(
				"CN=Mai Hong Quang,OU=NS,OU=TT CNTT,OU=VP VEC," +
					"DC=vec,DC=vn");

		_assertEquals(
			Arrays.asList("VP VEC", "TT CNTT", "NS"), organizationNames,
			"AD organization path");
		_assertEquals(
			Arrays.asList(
				"NS", "NS - TT CNTT", "NS - TT CNTT - VP VEC"),
			ADDistinguishedNameUtil.toOrganizationNameCandidates(
				organizationNames, 2),
			"Liferay organization name candidates");
	}

	private static void _assertEquals(
		Object expectedValue, Object actualValue, String label) {

		if (!expectedValue.equals(actualValue)) {
			throw new AssertionError(
				label + ": expected " + expectedValue + " but got " +
					actualValue);
		}
	}

}
