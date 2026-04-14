package vn.vec.custom.admin.webhook;

import com.liferay.portal.kernel.dao.jdbc.DataAccess;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;

import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import javax.ws.rs.Consumes;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/tinytalk")
public class WebhookResource {

	// Lấy từ TinyTalk Dashboard → Edit Webhook → Webhook Secret
	private static final String WEBHOOK_SECRET = "your-tinytalk-webhook-secret";

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response receiveTinyTalkWebhook(
		@HeaderParam("TinyTalk-Signature") String signature,
		@HeaderParam("Idempotency-Key") String idempotencyKey,
		String body) {

		// 1. Xác thực HMAC-SHA256 signature
		if (!_verifySignature(body, signature)) {
			_log.warn("Webhook rejected: invalid signature");

			return Response.status(Response.Status.UNAUTHORIZED)
				.entity("{\"error\":\"Unauthorized\"}")
				.build();
		}

		// 2. Deduplication
		if (idempotencyKey != null && !idempotencyKey.isEmpty()) {
			try {
				if (_isDuplicate(idempotencyKey)) {
					_log.info("Duplicate webhook ignored. Idempotency-Key: " + idempotencyKey);

					return Response.ok("{\"status\":\"ok\"}").build();
				}
			}
			catch (Exception e) {
				_log.warn("Could not check duplicate: " + e.getMessage());
			}
		}

		// 3. Parse payload
		WebhookPayload parsed = _parsePayload(body);

		// 4. Lưu DB
		try {
			_saveToDatabase(parsed, idempotencyKey, "RECEIVED", null);

			_log.info("Webhook received from TinyTalk. Event: " + parsed.eventType +
				", conversationId: " + parsed.conversationId +
				", contactId: " + parsed.contactId);
		}
		catch (Exception e) {
			_log.error("Error saving TinyTalk webhook: " + e.getMessage(), e);

			try {
				_saveToDatabase(parsed, idempotencyKey, "ERROR", e.getMessage());
			}
			catch (Exception ex) {
				_log.error("Failed to save error log: " + ex.getMessage(), ex);
			}
		}

		// 5. Luôn trả 200 để TinyTalk không retry
		return Response.ok("{\"status\":\"ok\"}").build();
	}

	/**
	 * Parse TinyTalk webhook body.
	 *
	 * Cấu trúc thực tế:
	 * {
	 *   "type": "message.created",
	 *   "payload": {
	 *     "message": { "role": "user", "content": "..." },
	 *     "botId": "...",
	 *     "conversationId": "...",
	 *     "contactId": "...",
	 *     "createdAt": "...",
	 *     "updatedAt": "..."
	 *   }
	 * }
	 */
	private WebhookPayload _parsePayload(String body) {
		WebhookPayload result = new WebhookPayload();
		result.rawPayload = body != null ? body : "";

		try {
			if (body == null || !body.trim().startsWith("{")) {
				return result;
			}

			JSONObject root = JSONFactoryUtil.createJSONObject(body);

			result.eventType = root.getString("type");

			JSONObject payload = root.getJSONObject("payload");

			if (payload != null) {
				result.botId = payload.getString("botId");
				result.conversationId = payload.getString("conversationId");
				result.contactId = payload.getString("contactId");
				result.createdAt = payload.getString("createdAt");

				JSONObject message = payload.getJSONObject("message");

				if (message != null) {
					result.messageRole = message.getString("role");
					result.messageContent = message.getString("content");
				}
			}
		}
		catch (Exception e) {
			_log.warn("Could not parse webhook body: " + e.getMessage());
		}

		return result;
	}

	private boolean _verifySignature(String body, String signature) {
		if (WEBHOOK_SECRET == null || WEBHOOK_SECRET.isEmpty()) {
			_log.warn("WEBHOOK_SECRET is not configured — skipping signature verification");

			return true;
		}

		if (signature == null || signature.isEmpty()) {
			return false;
		}

		try {
			Mac mac = Mac.getInstance("HmacSHA256");

			SecretKeySpec keySpec = new SecretKeySpec(
				WEBHOOK_SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256");

			mac.init(keySpec);

			byte[] hash = mac.doFinal(
				(body != null ? body : "").getBytes(StandardCharsets.UTF_8));

			StringBuilder hex = new StringBuilder();

			for (byte b : hash) {
				hex.append(String.format("%02x", b));
			}

			return hex.toString().equals(signature);
		}
		catch (Exception e) {
			_log.error("Error verifying signature: " + e.getMessage(), e);

			return false;
		}
	}

	private boolean _isDuplicate(String idempotencyKey) throws Exception {
		Connection con = DataAccess.getConnection();

		try {
			PreparedStatement ps = con.prepareStatement(
				"SELECT COUNT(*) FROM VEC_WebhookLog WHERE idempotencyKey = ?");

			try {
				ps.setString(1, idempotencyKey);

				ResultSet rs = ps.executeQuery();

				try {
					return rs.next() && rs.getInt(1) > 0;
				}
				finally {
					DataAccess.cleanUp(rs);
				}
			}
			finally {
				DataAccess.cleanUp(ps);
			}
		}
		finally {
			DataAccess.cleanUp(con);
		}
	}

	private void _saveToDatabase(
			WebhookPayload parsed, String idempotencyKey,
			String status, String errorMessage)
		throws Exception {

		Connection con = DataAccess.getConnection();

		try {
			PreparedStatement ps = con.prepareStatement(
				"INSERT INTO VEC_WebhookLog " +
				"(source, eventType, botId, conversationId, contactId, " +
				" messageRole, messageContent, rawPayload, idempotencyKey, " +
				" status, errorMessage, createDate) " +
				"VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

			try {
				ps.setString(1, "tinytalk");
				ps.setString(2, parsed.eventType);
				ps.setString(3, parsed.botId);
				ps.setString(4, parsed.conversationId);
				ps.setString(5, parsed.contactId);
				ps.setString(6, parsed.messageRole);
				ps.setString(7, parsed.messageContent);
				ps.setString(8, parsed.rawPayload);
				ps.setString(9, idempotencyKey);
				ps.setString(10, status);
				ps.setString(11, errorMessage);
				ps.setTimestamp(12, new Timestamp(System.currentTimeMillis()));
				ps.executeUpdate();
			}
			finally {
				DataAccess.cleanUp(ps);
			}
		}
		finally {
			DataAccess.cleanUp(con);
		}
	}

	private static class WebhookPayload {

		String eventType;
		String botId;
		String conversationId;
		String contactId;
		String messageRole;
		String messageContent;
		String createdAt;
		String rawPayload = "";

	}

	private static final Log _log = LogFactoryUtil.getLog(WebhookResource.class);

}
