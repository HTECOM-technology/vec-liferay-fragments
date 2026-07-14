package vn.vec.custom.admin.HookTollReconciliation;

import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

import java.nio.charset.StandardCharsets;

import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import javax.ws.rs.Consumes;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.HookTollReconciliation.auth.AuthenticationResult;
import vn.vec.custom.admin.HookTollReconciliation.auth.HookAuthenticator;
import vn.vec.custom.admin.HookTollReconciliation.model.HookPayload;
import vn.vec.custom.admin.HookTollReconciliation.model.HookRequestLog;
import vn.vec.custom.admin.HookTollReconciliation.model.ValidationResult;
import vn.vec.custom.admin.HookTollReconciliation.persistence.HookRequestLogRepository;
import vn.vec.custom.admin.HookTollReconciliation.persistence.TollReconciliationRepository;
import vn.vec.custom.admin.HookTollReconciliation.validation.PayloadValidator;

@Component(
	property = {
		"osgi.jaxrs.application.select=(osgi.jaxrs.name=Vec.Toll.Reconciliation)",
		"osgi.jaxrs.resource=true"
	},
	service = TollReconciliationResource.class
)
@Consumes(MediaType.APPLICATION_JSON)
@Path("/")
@Produces(MediaType.APPLICATION_JSON)
public class TollReconciliationResource {

	@POST
	@Path("/hook")
	public Response receive(
		@Context HttpServletRequest request,
		@HeaderParam(HookConstants.H_CLIENT_ID) String clientId,
		@HeaderParam(HookConstants.H_API_KEY) String apiKey,
		@HeaderParam(HookConstants.H_TIMESTAMP) String timestamp,
		@HeaderParam(HookConstants.H_NONCE) String nonce,
		@HeaderParam(HookConstants.H_SIGNATURE) String signature,
		@HeaderParam(HookConstants.H_TRANS_ID) String requestedTransId,
		InputStream inputStream) {

		String transId = _resolveTransId(requestedTransId);
		HookRequestLog requestLog = new HookRequestLog();
		Outcome outcome = null;

		requestLog.setTransId(transId);
		requestLog.setClientId(clientId);
		requestLog.setRemoteIp(_getRemoteIp(request));

		try {
			long contentLength = (request == null) ? -1 :
				request.getContentLengthLong();

			if (contentLength > HookConstants.MAX_BODY_BYTES) {
				requestLog.setBodySize(_toBodySize(contentLength));
				outcome = Outcome.error(
					413, "PAYLOAD_TOO_LARGE",
					"Body vượt quá " + HookConstants.MAX_BODY_BYTES + " byte.");

				return _respond(outcome, transId);
			}

			String transferEncoding = (request == null) ? null :
				request.getHeader("Transfer-Encoding");

			if ((transferEncoding != null) &&
				transferEncoding.toLowerCase().contains("chunked")) {

				_log.warn(
					"Toll hook received chunked request contrary to partner " +
						"agreement; transId=" + transId);
			}

			byte[] rawBody = _readBody(inputStream);

			requestLog.setBodySize(rawBody.length);

			if (HookConstants.LOG_RAW_BODY) {
				requestLog.setRawBody(
					new String(rawBody, StandardCharsets.UTF_8));
			}

			AuthenticationResult authenticationResult =
				_hookAuthenticator.authenticate(
					clientId, apiKey, timestamp, nonce, signature, rawBody);

			if (!authenticationResult.isSuccess()) {
				outcome = Outcome.error(
					authenticationResult.getHttpStatus(),
					authenticationResult.getErrorCode(),
					authenticationResult.getMessage());

				return _respond(outcome, transId);
			}

			requestLog.setAuthOk(true);

			ValidationResult validationResult = _payloadValidator.validate(rawBody);
			HookPayload payload = validationResult.getPayload();

			_populatePayloadLog(requestLog, payload);

			if (!validationResult.isValid()) {
				outcome = Outcome.validationError(validationResult.getErrors());

				return _respond(outcome, transId);
			}

			String recordType = payload.getString("record_type");

			if (!authenticationResult.getPartner().allowedRecordTypes().contains(
					recordType)) {

				outcome = Outcome.error(
					403, "RECORD_TYPE_FORBIDDEN",
					"Client không được phép gửi record_type này.");

				return _respond(outcome, transId);
			}

			String result = _tollReconciliationRepository.persist(
				payload, transId);

			outcome = Outcome.success(
				result, recordType, payload.getString("external_id"));

			return _respond(outcome, transId);
		}
		catch (BodyTooLargeException bodyTooLargeException) {
			requestLog.setBodySize(bodyTooLargeException.getActualSize());
			outcome = Outcome.error(
				413, "PAYLOAD_TOO_LARGE",
				"Body vượt quá " + HookConstants.MAX_BODY_BYTES + " byte.");

			return _respond(outcome, transId);
		}
		catch (Exception exception) {
			_log.error(
				"Toll reconciliation hook failed; transId=" + transId,
				exception);

			outcome = Outcome.error(
				500, "INTERNAL_ERROR", "Không thể xử lý request.");

			return _respond(outcome, transId);
		}
		finally {
			_applyOutcomeToLog(requestLog, outcome);

			try {
				_hookRequestLogRepository.insert(requestLog);
			}
			catch (Exception exception) {
				_log.warn(
					"Unable to write toll hook request audit; transId=" + transId,
					exception);
			}
		}
	}

	private void _applyOutcomeToLog(
		HookRequestLog requestLog, Outcome outcome) {

		if (outcome == null) {
			requestLog.setHttpStatus(500);
			requestLog.setResultAction("rejected");
			requestLog.setErrorCode("INTERNAL_ERROR");

			return;
		}

		requestLog.setHttpStatus(outcome.httpStatus);
		requestLog.setResultAction(
			outcome.success ? outcome.result : "rejected");
		requestLog.setErrorCode(outcome.errorCode);
		requestLog.setErrorMessage(outcome.message);
	}

	private String _getRemoteIp(HttpServletRequest request) {
		if (request == null) {
			return null;
		}

		String realIp = request.getHeader("X-Real-IP");

		if ((realIp != null) && !realIp.trim().isEmpty()) {
			return realIp.trim();
		}

		return request.getRemoteAddr();
	}

	private void _populatePayloadLog(
		HookRequestLog requestLog, HookPayload payload) {

		if (payload == null) {
			return;
		}

		requestLog.setSourceSystem(payload.getString("source_system"));
		requestLog.setExternalId(payload.getString("external_id"));
		requestLog.setRecordType(payload.getString("record_type"));
	}

	private byte[] _readBody(InputStream inputStream)
		throws IOException, BodyTooLargeException {

		if (inputStream == null) {
			return new byte[0];
		}

		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
		byte[] buffer = new byte[8192];
		int total = 0;
		int read;

		while ((read = inputStream.read(buffer)) != -1) {
			if (read == 0) {
				continue;
			}

			total += read;

			if (total > HookConstants.MAX_BODY_BYTES) {
				throw new BodyTooLargeException(total);
			}

			outputStream.write(buffer, 0, read);
		}

		return outputStream.toByteArray();
	}

	private String _resolveTransId(String requestedTransId) {
		if (requestedTransId != null) {
			String value = requestedTransId.trim();

			if (!value.isEmpty() &&
				(value.length() <= HookConstants.MAX_TRANS_ID_LENGTH)) {

				return value;
			}
		}

		return UUID.randomUUID().toString();
	}

	private Response _respond(Outcome outcome, String transId) {
		JSONObject jsonObject = JSONFactoryUtil.createJSONObject();

		jsonObject.put("success", outcome.success);
		jsonObject.put("trans_id", transId);

		if (outcome.success) {
			jsonObject.put("result", outcome.result);
			jsonObject.put("record_type", outcome.recordType);
			jsonObject.put("external_id", outcome.externalId);
		}
		else {
			jsonObject.put("error_code", outcome.errorCode);
			jsonObject.put("message", outcome.message);

			if ((outcome.errors != null) && !outcome.errors.isEmpty()) {
				JSONArray jsonArray = JSONFactoryUtil.createJSONArray();

				for (String error : outcome.errors) {
					jsonArray.put(error);
				}

				jsonObject.put("errors", jsonArray);
			}
		}

		return Response.status(outcome.httpStatus).type(
			MediaType.APPLICATION_JSON
		).entity(
			jsonObject.toString()
		).build();
	}

	private int _toBodySize(long bodySize) {
		return (bodySize > Integer.MAX_VALUE) ? Integer.MAX_VALUE :
			(int)Math.max(bodySize, 0);
	}

	private static class BodyTooLargeException extends Exception {

		private BodyTooLargeException(int actualSize) {
			_actualSize = actualSize;
		}

		private int getActualSize() {
			return _actualSize;
		}

		private final int _actualSize;
	}

	private static class Outcome {

		private static Outcome error(
			int httpStatus, String errorCode, String message) {

			return new Outcome(
				false, httpStatus, null, null, null, errorCode, message, null);
		}

		private static Outcome success(
			String result, String recordType, String externalId) {

			return new Outcome(
				true, 200, result, recordType, externalId, null, null, null);
		}

		private static Outcome validationError(List<String> errors) {
			return new Outcome(
				false, 400, null, null, null, "PAYLOAD_INVALID",
				"Payload không hợp lệ: " + String.join("; ", errors), errors);
		}

		private Outcome(
			boolean success, int httpStatus, String result, String recordType,
			String externalId, String errorCode, String message,
			List<String> errors) {

			this.success = success;
			this.httpStatus = httpStatus;
			this.result = result;
			this.recordType = recordType;
			this.externalId = externalId;
			this.errorCode = errorCode;
			this.message = message;
			this.errors = errors;
		}

		private final String errorCode;
		private final List<String> errors;
		private final String externalId;
		private final int httpStatus;
		private final String message;
		private final String recordType;
		private final String result;
		private final boolean success;
	}

	@Reference
	private HookAuthenticator _hookAuthenticator;

	@Reference
	private HookRequestLogRepository _hookRequestLogRepository;

	@Reference
	private PayloadValidator _payloadValidator;

	@Reference
	private TollReconciliationRepository _tollReconciliationRepository;

	private static final Log _log = LogFactoryUtil.getLog(
		TollReconciliationResource.class);
}
