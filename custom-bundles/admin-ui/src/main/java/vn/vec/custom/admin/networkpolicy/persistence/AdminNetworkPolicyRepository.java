package vn.vec.custom.admin.networkpolicy.persistence;

import com.liferay.counter.kernel.service.CounterLocalServiceUtil;
import com.liferay.portal.kernel.util.InfrastructureUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.sql.DataSource;

import org.osgi.service.component.annotations.Component;

import vn.vec.custom.admin.networkpolicy.model.AdminNetworkPolicy;

@Component(service = AdminNetworkPolicyRepository.class)
public class AdminNetworkPolicyRepository {

	public int count(long companyId, String keyword) throws Exception {
		List<Object> parameters = new ArrayList<>();
		StringBuilder sql = new StringBuilder(
			"select count(1) from VEC_AdminNetworkPolicy where companyId = ?");

		parameters.add(companyId);
		_appendKeywordFilter(sql, parameters, keyword);

		try (Connection connection = _getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				sql.toString())) {

			_fillParameters(preparedStatement, parameters);

			try (ResultSet resultSet = preparedStatement.executeQuery()) {
				if (resultSet.next()) {
					return resultSet.getInt(1);
				}
			}
		}

		return 0;
	}

	public void delete(long policyId) throws Exception {
		try (Connection connection = _getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				"delete from VEC_AdminNetworkPolicy where policyId = ?")) {

			preparedStatement.setLong(1, policyId);
			preparedStatement.executeUpdate();
		}
	}

	public AdminNetworkPolicy fetch(long policyId) throws Exception {
		try (Connection connection = _getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				"select * from VEC_AdminNetworkPolicy where policyId = ?")) {

			preparedStatement.setLong(1, policyId);

			try (ResultSet resultSet = preparedStatement.executeQuery()) {
				if (resultSet.next()) {
					return _mapRow(resultSet);
				}
			}
		}

		return null;
	}

	public List<AdminNetworkPolicy> getEnabled(long companyId) throws Exception {
		List<AdminNetworkPolicy> policies = new ArrayList<>();

		try (Connection connection = _getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				"select * from VEC_AdminNetworkPolicy where companyId = ? and " +
					"enabled = 1 order by priority asc, modifiedDate desc")) {

			preparedStatement.setLong(1, companyId);

			try (ResultSet resultSet = preparedStatement.executeQuery()) {
				while (resultSet.next()) {
					policies.add(_mapRow(resultSet));
				}
			}
		}

		return policies;
	}

	public boolean hasDuplicate(
			long companyId, String networkAddress, boolean enabled,
			long excludedPolicyId)
		throws Exception {

		try (Connection connection = _getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				"select count(1) from VEC_AdminNetworkPolicy where companyId = ? " +
					"and networkAddress = ? and enabled = ? and policyId <> ?")) {

			preparedStatement.setLong(1, companyId);
			preparedStatement.setString(2, networkAddress);
			preparedStatement.setBoolean(3, enabled);
			preparedStatement.setLong(4, excludedPolicyId);

			try (ResultSet resultSet = preparedStatement.executeQuery()) {
				return resultSet.next() && (resultSet.getInt(1) > 0);
			}
		}
	}

	public AdminNetworkPolicy insert(AdminNetworkPolicy policy) throws Exception {
		long policyId = CounterLocalServiceUtil.increment(
			"VEC_AdminNetworkPolicy");
		Date now = new Date();

		policy.setPolicyId(policyId);
		policy.setCreateDate(now);
		policy.setModifiedDate(now);

		String sql =
			"insert into VEC_AdminNetworkPolicy (" +
				"policyId, companyId, name, networkAddress, networkType, enabled, " +
				"description, priority, createDate, modifiedDate, userId, " +
				"userName, lastModifiedByUserId, lastModifiedByUserName" +
			") values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

		try (Connection connection = _getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(sql)) {

			int index = 1;

			preparedStatement.setLong(index++, policy.getPolicyId());
			preparedStatement.setLong(index++, policy.getCompanyId());
			preparedStatement.setString(index++, policy.getName());
			preparedStatement.setString(index++, policy.getNetworkAddress());
			preparedStatement.setString(index++, policy.getNetworkType());
			preparedStatement.setBoolean(index++, policy.isEnabled());
			preparedStatement.setString(index++, policy.getDescription());
			preparedStatement.setInt(index++, policy.getPriority());
			preparedStatement.setTimestamp(index++, _toTimestamp(policy.getCreateDate()));
			preparedStatement.setTimestamp(index++, _toTimestamp(policy.getModifiedDate()));
			preparedStatement.setLong(index++, policy.getUserId());
			preparedStatement.setString(index++, policy.getUserName());
			preparedStatement.setLong(index++, policy.getLastModifiedByUserId());
			preparedStatement.setString(index++, policy.getLastModifiedByUserName());
			preparedStatement.executeUpdate();
		}

		return policy;
	}

	public List<AdminNetworkPolicy> search(
			long companyId, String keyword, int start, int end)
		throws Exception {

		List<Object> parameters = new ArrayList<>();
		StringBuilder sql = new StringBuilder(
			"select * from VEC_AdminNetworkPolicy where companyId = ?");

		parameters.add(companyId);
		_appendKeywordFilter(sql, parameters, keyword);
		sql.append(" order by priority asc, modifiedDate desc limit ? offset ?");
		parameters.add(Math.max(0, end - start));
		parameters.add(Math.max(0, start));

		List<AdminNetworkPolicy> policies = new ArrayList<>();

		try (Connection connection = _getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				sql.toString())) {

			_fillParameters(preparedStatement, parameters);

			try (ResultSet resultSet = preparedStatement.executeQuery()) {
				while (resultSet.next()) {
					policies.add(_mapRow(resultSet));
				}
			}
		}

		return policies;
	}

	public AdminNetworkPolicy update(AdminNetworkPolicy policy) throws Exception {
		policy.setModifiedDate(new Date());

		String sql =
			"update VEC_AdminNetworkPolicy set name = ?, networkAddress = ?, " +
				"networkType = ?, enabled = ?, description = ?, priority = ?, " +
				"modifiedDate = ?, lastModifiedByUserId = ?, " +
				"lastModifiedByUserName = ? where policyId = ?";

		try (Connection connection = _getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(sql)) {

			int index = 1;

			preparedStatement.setString(index++, policy.getName());
			preparedStatement.setString(index++, policy.getNetworkAddress());
			preparedStatement.setString(index++, policy.getNetworkType());
			preparedStatement.setBoolean(index++, policy.isEnabled());
			preparedStatement.setString(index++, policy.getDescription());
			preparedStatement.setInt(index++, policy.getPriority());
			preparedStatement.setTimestamp(index++, _toTimestamp(policy.getModifiedDate()));
			preparedStatement.setLong(index++, policy.getLastModifiedByUserId());
			preparedStatement.setString(index++, policy.getLastModifiedByUserName());
			preparedStatement.setLong(index++, policy.getPolicyId());
			preparedStatement.executeUpdate();
		}

		return policy;
	}

	private void _appendKeywordFilter(
		StringBuilder sql, List<Object> parameters, String keyword) {

		if ((keyword == null) || keyword.trim().isEmpty()) {
			return;
		}

		String likeKeyword = "%" + keyword.trim().toLowerCase() + "%";

		sql.append(
			" and (lower(name) like ? or lower(networkAddress) like ? or " +
				"lower(coalesce(description, '')) like ?)");
		parameters.add(likeKeyword);
		parameters.add(likeKeyword);
		parameters.add(likeKeyword);
	}

	private void _fillParameters(
			PreparedStatement preparedStatement, List<Object> parameters)
		throws Exception {

		for (int i = 0; i < parameters.size(); i++) {
			Object value = parameters.get(i);

			if (value instanceof Integer) {
				preparedStatement.setInt(i + 1, (Integer)value);
			}
			else if (value instanceof Long) {
				preparedStatement.setLong(i + 1, (Long)value);
			}
			else {
				preparedStatement.setString(i + 1, String.valueOf(value));
			}
		}
	}

	private Connection _getConnection() throws Exception {
		DataSource dataSource = InfrastructureUtil.getDataSource();

		if (dataSource == null) {
			throw new IllegalStateException("Liferay data source is not available");
		}

		return dataSource.getConnection();
	}

	private AdminNetworkPolicy _mapRow(ResultSet resultSet) throws Exception {
		AdminNetworkPolicy policy = new AdminNetworkPolicy();

		policy.setPolicyId(resultSet.getLong("policyId"));
		policy.setCompanyId(resultSet.getLong("companyId"));
		policy.setName(resultSet.getString("name"));
		policy.setNetworkAddress(resultSet.getString("networkAddress"));
		policy.setNetworkType(resultSet.getString("networkType"));
		policy.setEnabled(resultSet.getBoolean("enabled"));
		policy.setDescription(resultSet.getString("description"));
		policy.setPriority(resultSet.getInt("priority"));
		policy.setCreateDate(_toDate(resultSet.getTimestamp("createDate")));
		policy.setModifiedDate(_toDate(resultSet.getTimestamp("modifiedDate")));
		policy.setUserId(resultSet.getLong("userId"));
		policy.setUserName(resultSet.getString("userName"));
		policy.setLastModifiedByUserId(
			resultSet.getLong("lastModifiedByUserId"));
		policy.setLastModifiedByUserName(
			resultSet.getString("lastModifiedByUserName"));

		return policy;
	}

	private Date _toDate(Timestamp timestamp) {
		if (timestamp == null) {
			return null;
		}

		return new Date(timestamp.getTime());
	}

	private Timestamp _toTimestamp(Date date) {
		if (date == null) {
			return null;
		}

		return new Timestamp(date.getTime());
	}

}
