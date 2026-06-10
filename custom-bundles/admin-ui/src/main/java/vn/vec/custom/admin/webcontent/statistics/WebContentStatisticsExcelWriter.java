package vn.vec.custom.admin.webcontent.statistics;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
public class WebContentStatisticsExcelWriter {

	public File write(
			WebContentStatisticsQuery query, WebContentStatisticsSummary summary,
			File rawDataFile)
		throws IOException {

		File outputFile = File.createTempFile("webcontent-statistics-", ".xlsx");

		try (ZipOutputStream zipOutputStream = new ZipOutputStream(
				new FileOutputStream(outputFile))) {

			_writeTextEntry(
				zipOutputStream, "[Content_Types].xml",
				_buildContentTypesXml(query.isIncludeRawData()));
			_writeTextEntry(zipOutputStream, "_rels/.rels", _buildRootRelsXml());
			_writeTextEntry(
				zipOutputStream, "xl/workbook.xml",
				_buildWorkbookXml(query.isIncludeRawData()));
			_writeTextEntry(
				zipOutputStream, "xl/_rels/workbook.xml.rels",
				_buildWorkbookRelsXml(query.isIncludeRawData()));
			_writeTextEntry(zipOutputStream, "xl/styles.xml", _buildStylesXml());

			_writeSummarySheet(zipOutputStream, query, summary);
			_writeByStatusSheet(zipOutputStream, summary);
			_writeByStructureSheet(zipOutputStream, summary);
			_writeByFolderSheet(zipOutputStream, summary);
			_writeByUserSheet(zipOutputStream, summary);

			if (query.isIncludeRawData() && (rawDataFile != null)) {
				_writeRawDataSheet(zipOutputStream, rawDataFile);
			}
		}

		return outputFile;
	}

	private String _buildContentTypesXml(boolean includeRawData) {
		StringBuilder sb = new StringBuilder();

		sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>");
		sb.append(
			"<Types xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\">");
		sb.append(
			"<Default Extension=\"rels\" ContentType=\"application/vnd.openxmlformats-package.relationships+xml\"/>");
		sb.append(
			"<Default Extension=\"xml\" ContentType=\"application/xml\"/>");
		sb.append(
			"<Override PartName=\"/xl/workbook.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml\"/>");
		sb.append(
			"<Override PartName=\"/xl/styles.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml\"/>");
		sb.append(
			"<Override PartName=\"/xl/worksheets/sheet1.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml\"/>");
		sb.append(
			"<Override PartName=\"/xl/worksheets/sheet2.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml\"/>");
		sb.append(
			"<Override PartName=\"/xl/worksheets/sheet3.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml\"/>");
		sb.append(
			"<Override PartName=\"/xl/worksheets/sheet4.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml\"/>");
		sb.append(
			"<Override PartName=\"/xl/worksheets/sheet5.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml\"/>");

		if (includeRawData) {
			sb.append(
				"<Override PartName=\"/xl/worksheets/sheet6.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml\"/>");
		}

		sb.append("</Types>");

		return sb.toString();
	}

	private String _buildRootRelsXml() {
		return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>" +
			"<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">" +
			"<Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument\" Target=\"xl/workbook.xml\"/>" +
			"</Relationships>";
	}

	private String _buildStylesXml() {
		return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>" +
			"<styleSheet xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\">" +
			"<fonts count=\"2\">" +
			"<font><sz val=\"11\"/><name val=\"Calibri\"/></font>" +
			"<font><b/><sz val=\"11\"/><name val=\"Calibri\"/></font>" +
			"</fonts>" +
			"<fills count=\"2\">" +
			"<fill><patternFill patternType=\"none\"/></fill>" +
			"<fill><patternFill patternType=\"solid\"><fgColor rgb=\"FFD9E2F3\"/><bgColor indexed=\"64\"/></patternFill></fill>" +
			"</fills>" +
			"<borders count=\"1\"><border><left/><right/><top/><bottom/><diagonal/></border></borders>" +
			"<cellStyleXfs count=\"1\"><xf numFmtId=\"0\" fontId=\"0\" fillId=\"0\" borderId=\"0\"/></cellStyleXfs>" +
			"<cellXfs count=\"2\">" +
			"<xf numFmtId=\"0\" fontId=\"0\" fillId=\"0\" borderId=\"0\" xfId=\"0\"/>" +
			"<xf numFmtId=\"0\" fontId=\"1\" fillId=\"1\" borderId=\"0\" xfId=\"0\" applyFont=\"1\" applyFill=\"1\"/>" +
			"</cellXfs>" +
			"<cellStyles count=\"1\"><cellStyle name=\"Normal\" xfId=\"0\" builtinId=\"0\"/></cellStyles>" +
			"</styleSheet>";
	}

	private String _buildWorkbookRelsXml(boolean includeRawData) {
		StringBuilder sb = new StringBuilder();

		sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>");
		sb.append(
			"<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">");
		sb.append(
			"<Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet\" Target=\"worksheets/sheet1.xml\"/>");
		sb.append(
			"<Relationship Id=\"rId2\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet\" Target=\"worksheets/sheet2.xml\"/>");
		sb.append(
			"<Relationship Id=\"rId3\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet\" Target=\"worksheets/sheet3.xml\"/>");
		sb.append(
			"<Relationship Id=\"rId4\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet\" Target=\"worksheets/sheet4.xml\"/>");
		sb.append(
			"<Relationship Id=\"rId5\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet\" Target=\"worksheets/sheet5.xml\"/>");

		if (includeRawData) {
			sb.append(
				"<Relationship Id=\"rId6\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet\" Target=\"worksheets/sheet6.xml\"/>");
			sb.append(
				"<Relationship Id=\"rId7\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles\" Target=\"styles.xml\"/>");
		}
		else {
			sb.append(
				"<Relationship Id=\"rId6\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles\" Target=\"styles.xml\"/>");
		}

		sb.append("</Relationships>");

		return sb.toString();
	}

	private String _buildWorkbookXml(boolean includeRawData) {
		StringBuilder sb = new StringBuilder();

		sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>");
		sb.append(
			"<workbook xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\">");
		sb.append("<sheets>");
		sb.append("<sheet name=\"Tổng quan\" sheetId=\"1\" r:id=\"rId1\"/>");
		sb.append("<sheet name=\"Thống kê bởi trạng thái\" sheetId=\"2\" r:id=\"rId2\"/>");
		sb.append("<sheet name=\"Thông kê bởi cấu trúc\" sheetId=\"3\" r:id=\"rId3\"/>");
		sb.append("<sheet name=\"Thống kê bởi thư mục\" sheetId=\"4\" r:id=\"rId4\"/>");
		sb.append("<sheet name=\"Thống kê bởi người đăng\" sheetId=\"5\" r:id=\"rId5\"/>");

		if (includeRawData) {
			sb.append("<sheet name=\"Dữ liệu chi tiết\" sheetId=\"6\" r:id=\"rId6\"/>");
		}

		sb.append("</sheets></workbook>");

		return sb.toString();
	}

	private String _formatPercentage(double value) {
		DecimalFormatSymbols symbols = new DecimalFormatSymbols(Locale.US);
		DecimalFormat decimalFormat = new DecimalFormat("0.00", symbols);

		return decimalFormat.format(value) + "%";
	}

	private void _writeByFolderSheet(
			ZipOutputStream zipOutputStream, WebContentStatisticsSummary summary)
		throws IOException {

		ZipEntry zipEntry = new ZipEntry("xl/worksheets/sheet4.xml");

		zipOutputStream.putNextEntry(zipEntry);

		try (SheetWriter sheetWriter = new SheetWriter(zipOutputStream)) {
			sheetWriter.writeRow(
				_headerRow(
					"ID Thư mục", "Đường dẫn", "Chuyên mục", "Tổng",
					"Phần trăm"));

			for (WebContentStatisticsSummary.FolderSummaryItem item :
					summary.getFolderItems()) {

				sheetWriter.writeRow(
					_row(
						String.valueOf(item.getFolderId()), item.getFolderPath(),
						item.getFolderShortName(),
						String.valueOf(item.getCount()),
						_formatPercentage(summary.toPercentage(item.getCount()))));
			}
		}

		zipOutputStream.closeEntry();
	}

	private void _writeByStatusSheet(
			ZipOutputStream zipOutputStream, WebContentStatisticsSummary summary)
		throws IOException {

		ZipEntry zipEntry = new ZipEntry("xl/worksheets/sheet2.xml");

		zipOutputStream.putNextEntry(zipEntry);

		try (SheetWriter sheetWriter = new SheetWriter(zipOutputStream)) {
			sheetWriter.writeRow(
				_headerRow("Mã trạng thái", "Trạng thái", "Tổng", "Phần trăm"));

			for (WebContentStatisticsSummary.StatusSummaryItem item :
					summary.getStatusItems()) {

				sheetWriter.writeRow(
					_row(
						String.valueOf(item.getStatus()), item.getStatusLabel(),
						String.valueOf(item.getCount()),
						_formatPercentage(summary.toPercentage(item.getCount()))));
			}
		}

		zipOutputStream.closeEntry();
	}

	private void _writeByStructureSheet(
			ZipOutputStream zipOutputStream, WebContentStatisticsSummary summary)
		throws IOException {

		ZipEntry zipEntry = new ZipEntry("xl/worksheets/sheet3.xml");

		zipOutputStream.putNextEntry(zipEntry);

		try (SheetWriter sheetWriter = new SheetWriter(zipOutputStream)) {
			sheetWriter.writeRow(
				_headerRow(
					"ID Cấu trúc", "Tên cấu trúc", "Tổng", "Phần trăm"));

			for (WebContentStatisticsSummary.StructureSummaryItem item :
					summary.getStructureItems()) {

				sheetWriter.writeRow(
					_row(
						String.valueOf(item.getStructureId()),
						item.getStructureName(), String.valueOf(item.getCount()),
						_formatPercentage(summary.toPercentage(item.getCount()))));
			}
		}

		zipOutputStream.closeEntry();
	}

	private void _writeByUserSheet(
			ZipOutputStream zipOutputStream, WebContentStatisticsSummary summary)
		throws IOException {

		ZipEntry zipEntry = new ZipEntry("xl/worksheets/sheet5.xml");

		zipOutputStream.putNextEntry(zipEntry);

		try (SheetWriter sheetWriter = new SheetWriter(zipOutputStream)) {
			sheetWriter.writeRow(
				_headerRow("ID", "Tên người dùng", "Tổng", "Phần trăm"));

			for (WebContentStatisticsSummary.UserSummaryItem item :
					summary.getUserItems()) {

				sheetWriter.writeRow(
					_row(
						String.valueOf(item.getUserId()), item.getUserName(),
						String.valueOf(item.getCount()),
						_formatPercentage(summary.toPercentage(item.getCount()))));
			}
		}

		zipOutputStream.closeEntry();
	}

	private void _writeRawDataSheet(
			ZipOutputStream zipOutputStream, File rawDataFile)
		throws IOException {

		ZipEntry zipEntry = new ZipEntry("xl/worksheets/sheet6.xml");

		zipOutputStream.putNextEntry(zipEntry);

		try (SheetWriter sheetWriter = new SheetWriter(zipOutputStream);
			BufferedReader bufferedReader = new BufferedReader(
				new InputStreamReader(
					new FileInputStream(rawDataFile), StandardCharsets.UTF_8))) {

			sheetWriter.writeRow(_headerRow(_getRawDataHeaders()));

			String line;

			while ((line = bufferedReader.readLine()) != null) {
				sheetWriter.writeRow(_row(WebContentStatisticsRow.deserializeValues(line)));
			}
		}

		zipOutputStream.closeEntry();
	}

	private void _writeSummarySheet(
			ZipOutputStream zipOutputStream, WebContentStatisticsQuery query,
			WebContentStatisticsSummary summary)
		throws IOException {

		ZipEntry zipEntry = new ZipEntry("xl/worksheets/sheet1.xml");

		zipOutputStream.putNextEntry(zipEntry);

		try (SheetWriter sheetWriter = new SheetWriter(zipOutputStream)) {
			sheetWriter.writeRow(_headerRow("Chỉ số", "Giá trị"));
			sheetWriter.writeRow(_row("Thời gian xuất", String.valueOf(new Date())));
			sheetWriter.writeRow(_row("Group ID", String.valueOf(query.getGroupId())));
			sheetWriter.writeRow(
				_row("Mã trạng thái lọc", String.valueOf(query.getStatus())));
			sheetWriter.writeRow(
				_row("Trạng thái lọc", WebContentStatisticsRow.toStatusLabel(query.getStatus())));
			sheetWriter.writeRow(
				_row("Chỉ lấy bản mới nhất", String.valueOf(query.isLatestOnly())));
			sheetWriter.writeRow(
				_row("Bao gồm phiên bản", String.valueOf(query.isIncludeVersions())));
			sheetWriter.writeRow(
				_row(
					"Chỉ lấy bản mới nhất (thực tế)",
					String.valueOf(query.isLatestOnlyEffective())));
			sheetWriter.writeRow(
				_row("ID Thư mục", String.valueOf(query.getFolderId())));
			sheetWriter.writeRow(
				_row("ID Cấu trúc", String.valueOf(query.getStructureId())));
			sheetWriter.writeRow(_row("ID Người dùng", String.valueOf(query.getUserId())));
			sheetWriter.writeRow(
				_row("Ngôn ngữ", String.valueOf(query.getLanguageId())));
			sheetWriter.writeRow(
				_row("Tổng số Web Content", String.valueOf(summary.getTotalCount())));
			sheetWriter.writeEmptyRow();

			_writeSummarySection(
				sheetWriter, "Thống kê bởi trạng thái",
				_headerRow("Mã trạng thái", "Trạng thái", "Tổng", "Phần trăm"));

			for (WebContentStatisticsSummary.StatusSummaryItem item :
					summary.getStatusItems()) {

				sheetWriter.writeRow(
					_row(
						String.valueOf(item.getStatus()), item.getStatusLabel(),
						String.valueOf(item.getCount()),
						_formatPercentage(summary.toPercentage(item.getCount()))));
			}

			sheetWriter.writeEmptyRow();
			_writeSummarySection(
				sheetWriter, "Thông kê bởi cấu trúc",
				_headerRow(
					"ID Cấu trúc", "Tên cấu trúc", "Tổng", "Phần trăm"));

			for (WebContentStatisticsSummary.StructureSummaryItem item :
					summary.getStructureItems()) {

				sheetWriter.writeRow(
					_row(
						String.valueOf(item.getStructureId()),
						item.getStructureName(), String.valueOf(item.getCount()),
						_formatPercentage(summary.toPercentage(item.getCount()))));
			}

			sheetWriter.writeEmptyRow();
			_writeSummarySection(
				sheetWriter, "Thống kê bởi thư mục",
				_headerRow(
					"ID Thư mục", "Đường dẫn", "Chuyên mục", "Tổng",
					"Phần trăm"));

			for (WebContentStatisticsSummary.FolderSummaryItem item :
					summary.getFolderItems()) {

				sheetWriter.writeRow(
					_row(
						String.valueOf(item.getFolderId()), item.getFolderPath(),
						item.getFolderShortName(),
						String.valueOf(item.getCount()),
						_formatPercentage(summary.toPercentage(item.getCount()))));
			}

			sheetWriter.writeEmptyRow();
			_writeSummarySection(
				sheetWriter, "Thống kê bởi người đăng",
				_headerRow("ID", "Tên người dùng", "Tổng", "Phần trăm"));

			for (WebContentStatisticsSummary.UserSummaryItem item :
					summary.getUserItems()) {

				sheetWriter.writeRow(
					_row(
						String.valueOf(item.getUserId()), item.getUserName(),
						String.valueOf(item.getCount()),
						_formatPercentage(summary.toPercentage(item.getCount()))));
			}

			sheetWriter.writeEmptyRow();
			_writeSummarySection(
				sheetWriter, "Thống kê theo tháng tạo bài",
				_headerRow("Tháng", "Tổng", "Phần trăm"));

			for (WebContentStatisticsSummary.SummaryItem item :
					summary.getCreateMonthItems()) {

				sheetWriter.writeRow(
					_row(
						item.getLabel(), String.valueOf(item.getCount()),
						_formatPercentage(summary.toPercentage(item.getCount()))));
			}

			sheetWriter.writeEmptyRow();
			_writeSummarySection(
				sheetWriter, "Thống kê theo tháng cập nhật",
				_headerRow("Tháng", "Tổng", "Phần trăm"));

			for (WebContentStatisticsSummary.SummaryItem item :
					summary.getModifiedMonthItems()) {

				sheetWriter.writeRow(
					_row(
						item.getLabel(), String.valueOf(item.getCount()),
						_formatPercentage(summary.toPercentage(item.getCount()))));
			}
		}

		zipOutputStream.closeEntry();
	}

	private void _writeSummarySection(
			SheetWriter sheetWriter, String title, List<Cell> headers)
		throws IOException {

		sheetWriter.writeRow(_headerRow(title));
		sheetWriter.writeRow(headers);
	}

	private void _writeTextEntry(
			ZipOutputStream zipOutputStream, String path, String content)
		throws IOException {

		zipOutputStream.putNextEntry(new ZipEntry(path));
		zipOutputStream.write(content.getBytes(StandardCharsets.UTF_8));

		zipOutputStream.closeEntry();
	}

	private List<String> _getRawDataHeaders() {
		List<String> headers = new ArrayList<>();

		headers.add("ID");
		headers.add("UUID");
		headers.add("Resource Prim Key");
		headers.add("Group ID");
		headers.add("Company ID");
		headers.add("ID Thư mục");
		headers.add("Đường dẫn");
		headers.add("Article ID");
		headers.add("Phiên bản");
		headers.add("Tiêu đề");
		headers.add("URL Title");
		headers.add("ID Cấu trúc");
		headers.add("Mã biểu mẫu");
		headers.add("Tên cấu trúc");
		headers.add("ID");
		headers.add("Tên người dùng");
		headers.add("Mã trạng thái");
		headers.add("Trạng thái");
		headers.add("ID người xử lý trạng thái");
		headers.add("Người xử lý trạng thái");
		headers.add("Ngày tạo");
		headers.add("Ngày cập nhật");
		headers.add("Ngày hiển thị");
		headers.add("Ngày hết hạn");
		headers.add("Ngày rà soát");
		headers.add("Cho phép index");
		headers.add("Ảnh nhỏ");
		headers.add("ID ảnh nhỏ");
		headers.add("URL ảnh nhỏ");

		return headers;
	}

	private List<Cell> _headerRow(List<String> values) {
		List<Cell> row = new ArrayList<>(values.size());

		for (String value : values) {
			row.add(new Cell(value, true));
		}

		return row;
	}

	private List<Cell> _headerRow(String... values) {
		List<Cell> row = new ArrayList<>(values.length);

		for (String value : values) {
			row.add(new Cell(value, true));
		}

		return row;
	}

	private List<Cell> _row(List<String> values) {
		List<Cell> row = new ArrayList<>(values.size());

		for (String value : values) {
			row.add(new Cell(value, false));
		}

		return row;
	}

	private List<Cell> _row(String... values) {
		List<Cell> row = new ArrayList<>(values.length);

		for (String value : values) {
			row.add(new Cell(value, false));
		}

		return row;
	}

	private static class Cell {

		public Cell(String value, boolean header) {
			_value = value;
			_header = header;
		}

		private final boolean _header;
		private final String _value;

	}

	private static class SheetWriter implements AutoCloseable {

		public SheetWriter(ZipOutputStream zipOutputStream) throws IOException {
			_writer = new BufferedWriter(
				new OutputStreamWriter(zipOutputStream, StandardCharsets.UTF_8));

			_writer.write(
				"<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>");
			_writer.write(
				"<worksheet xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\">");
			_writer.write("<sheetData>");
		}

		@Override
		public void close() throws IOException {
			_writer.write("</sheetData></worksheet>");
			_writer.flush();
		}

		public void writeEmptyRow() throws IOException {
			writeRow(new ArrayList<Cell>());
		}

		public void writeRow(List<Cell> cells) throws IOException {
			_rowIndex++;
			_writer.write("<row r=\"");
			_writer.write(String.valueOf(_rowIndex));
			_writer.write("\">");

			for (int i = 0; i < cells.size(); i++) {
				_writeCell(i + 1, _rowIndex, cells.get(i));
			}

			_writer.write("</row>");
		}

		private String _columnName(int columnIndex) {
			StringBuilder sb = new StringBuilder();
			int current = columnIndex;

			while (current > 0) {
				int remainder = (current - 1) % 26;
				sb.insert(0, (char)('A' + remainder));
				current = (current - 1) / 26;
			}

			return sb.toString();
		}

		private String _escapeXml(String value) {
			if (value == null) {
				return "";
			}

			return value.replace("&", "&amp;").replace("<", "&lt;").replace(
				">", "&gt;").replace("\"", "&quot;");
		}

		private void _writeCell(int columnIndex, int rowIndex, Cell cell)
			throws IOException {

			_writer.write("<c r=\"");
			_writer.write(_columnName(columnIndex));
			_writer.write(String.valueOf(rowIndex));
			_writer.write("\" t=\"inlineStr\"");

			if (cell._header) {
				_writer.write(" s=\"1\"");
			}

			_writer.write("><is><t xml:space=\"preserve\">");
			_writer.write(_escapeXml(cell._value));
			_writer.write("</t></is></c>");
		}

		private int _rowIndex;
		private final BufferedWriter _writer;

	}

}
