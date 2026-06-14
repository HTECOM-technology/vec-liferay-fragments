package vn.vec.custom.admin.webcontent.advancedsearch;

import java.util.Collections;
import java.util.List;

public class WebContentAdvancedSearchResult {

	public WebContentAdvancedSearchResult(
		List<WebContentAdvancedSearchRow> items, int total, int page,
		int pageSize) {

		_items = (items == null) ? Collections.emptyList() :
			Collections.unmodifiableList(items);
		_total = total;
		_page = page;
		_pageSize = pageSize;
	}

	public List<WebContentAdvancedSearchRow> getItems() {
		return _items;
	}

	public int getPage() {
		return _page;
	}

	public int getPageSize() {
		return _pageSize;
	}

	public int getTotal() {
		return _total;
	}

	private final List<WebContentAdvancedSearchRow> _items;
	private final int _page;
	private final int _pageSize;
	private final int _total;

}
