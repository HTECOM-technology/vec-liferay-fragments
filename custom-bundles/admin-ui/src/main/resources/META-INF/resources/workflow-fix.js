(function () {
	

	const CONFIG = {
		formId: '_com_liferay_journal_web_portlet_JournalPortlet_fm1',

		targetButtonSelector:
			'button.dropdown-item[form="_com_liferay_journal_web_portlet_JournalPortlet_fm1"]',

		debug: true,

		// Trừ 10 phút để chắc chắn không bị xem là thời điểm tương lai.
		minusMinutes: 10,

		// Fallback nếu không lấy được timezone Liferay:
		// set displayDate về 24h trước, tránh bị Scheduled.
		fallbackMinusHours: 24,
	};

	let waitingForWorkflowModal = false;
	let waitingExpiredAt = 0;

	function log(...args) {
		if (CONFIG.debug) {
			console.log('[Journal Workflow DisplayDate Fix]', ...args);
		}
	}

	function isTargetWorkflowButton(element) {
		const button = element.closest(CONFIG.targetButtonSelector);

		if (!button) {
			return false;
		}

		// Không dùng text. Chỉ bắt option có icon arrow-right-full.
		const hasArrowRightIcon =
			button.querySelector(
				'svg.lexicon-icon-arrow-right-full use[href*="#arrow-right-full"]'
			) ||
			button.querySelector(
				'svg.lexicon-icon-arrow-right-full use[xlink\\:href*="#arrow-right-full"]'
			) ||
			button.innerHTML.includes('#arrow-right-full');

		return Boolean(hasArrowRightIcon);
	}

	function getLiferayTimeZone() {
		try {
			if (
				window.Liferay &&
				window.Liferay.ThemeDisplay &&
				typeof window.Liferay.ThemeDisplay.getTimeZone === 'function'
			) {
				return window.Liferay.ThemeDisplay.getTimeZone();
			}
		} catch (e) {
			// Ignore.
		}

		return null;
	}

	function getDatePartsInTimeZone(date, timeZone) {
		const formatter = new Intl.DateTimeFormat('en-US', {
			timeZone,
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		});

		const parts = formatter.formatToParts(date);
		const map = {};

		parts.forEach((part) => {
			if (part.type !== 'literal') {
				map[part.type] = part.value;
			}
		});

		let hour = Number(map.hour);

		if (hour === 24) {
			hour = 0;
		}

		return {
			day: Number(map.day),
			month: Number(map.month) - 1, // Liferay dùng 0-11
			year: Number(map.year),
			hour,
			minute: Number(map.minute),
			source: 'liferay-timezone',
			timeZone,
		};
	}

	function getSafeDisplayDateParts() {
		const liferayTimeZone = getLiferayTimeZone();

		const now = new Date();
		now.setMinutes(now.getMinutes() - CONFIG.minusMinutes);

		if (liferayTimeZone) {
			try {
				return getDatePartsInTimeZone(now, liferayTimeZone);
			} catch (e) {
				log('Cannot format date by Liferay timezone, fallback used', {
					liferayTimeZone,
					error: e,
				});
			}
		}

		// Fallback: dùng thời điểm 24h trước theo browser timezone.
		// Mục tiêu là chắc chắn displayDate <= now sau mọi kiểu convert timezone.
		const fallbackDate = new Date();
		fallbackDate.setHours(fallbackDate.getHours() - CONFIG.fallbackMinusHours);

		return {
			day: fallbackDate.getDate(),
			month: fallbackDate.getMonth(),
			year: fallbackDate.getFullYear(),
			hour: fallbackDate.getHours(),
			minute: fallbackDate.getMinutes(),
			source: 'fallback-browser-time-minus-24h',
			timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		};
	}

	function getAllDisplayDateInputsBySuffix(suffix) {
		const selectors = [
			`input[form="${CONFIG.formId}"][name$="${suffix}"]`,
			`form#${CSS.escape(CONFIG.formId)} input[name$="${suffix}"]`,
			`input[name$="${suffix}"]`,
		];

		return Array.from(document.querySelectorAll(selectors.join(',')));
	}

	function setInputValueBySuffix(suffix, value) {
		const inputs = getAllDisplayDateInputsBySuffix(suffix);

		inputs.forEach((input) => {
			input.value = String(value);
			input.setAttribute('value', String(value));

			input.dispatchEvent(new Event('input', { bubbles: true }));
			input.dispatchEvent(new Event('change', { bubbles: true }));
		});

		return inputs.length;
	}

	function patchDisplayDateToSafeNow() {
		const parts = getSafeDisplayDateParts();

		const counts = {
			day: setInputValueBySuffix('displayDateDay', parts.day),
			month: setInputValueBySuffix('displayDateMonth', parts.month),
			year: setInputValueBySuffix('displayDateYear', parts.year),
			hour: setInputValueBySuffix('displayDateHour', parts.hour),
			minute: setInputValueBySuffix('displayDateMinute', parts.minute),
		};

		log('Patched displayDate', {
			...parts,
			counts,
		});

		return counts;
	}

	function findWorkflowModalWithDisplayDateInputs() {
		const modals = document.querySelectorAll('.modal.show, .modal.fade.show');

		for (const modal of modals) {
			const hasDisplayDateInputs = modal.querySelector(
				`input[form="${CONFIG.formId}"][name$="displayDateYear"], input[name$="displayDateYear"]`
			);

			if (hasDisplayDateInputs) {
				return modal;
			}
		}

		return null;
	}

	function patchModalIfNeeded() {
		if (!waitingForWorkflowModal) {
			return;
		}

		if (Date.now() > waitingExpiredAt) {
			waitingForWorkflowModal = false;
			waitingExpiredAt = 0;
			log('Waiting expired');
			return;
		}

		const modal = findWorkflowModalWithDisplayDateInputs();

		if (!modal) {
			return;
		}

		modal.dataset.vecWorkflowPatchDisplayDate = '1';

		// Patch toàn document/form, không chỉ patch trong modal.
		patchDisplayDateToSafeNow();

		log('Workflow modal detected and marked');
	}

	function isInsidePatchedModal(element) {
		return Boolean(
			element.closest('.modal[data-vec-workflow-patch-display-date="1"]')
		);
	}

	document.addEventListener(
		'click',
		function (event) {
			const target = event.target;

			if (isTargetWorkflowButton(target)) {
				waitingForWorkflowModal = true;
				waitingExpiredAt = Date.now() + 15000;

				log('Target workflow button clicked. Waiting for modal...');

				setTimeout(patchModalIfNeeded, 50);
				setTimeout(patchModalIfNeeded, 150);
				setTimeout(patchModalIfNeeded, 300);
				setTimeout(patchModalIfNeeded, 700);
				setTimeout(patchModalIfNeeded, 1200);

				return;
			}

			if (isInsidePatchedModal(target)) {
				// Patch lại ngay trước mọi click trong modal,
				// bao gồm nút submit cuối cùng.
				patchDisplayDateToSafeNow();

				setTimeout(function () {
					patchDisplayDateToSafeNow();
				}, 0);
			}
		},
		true
	);

	document.addEventListener(
		'submit',
		function () {
			const patchedModal = document.querySelector(
				'.modal[data-vec-workflow-patch-display-date="1"]'
			);

			if (patchedModal) {
				patchDisplayDateToSafeNow();

				waitingForWorkflowModal = false;
				waitingExpiredAt = 0;

				log('Form submit detected. Patched before submit.');
			}
		},
		true
	);

	const observer = new MutationObserver(function () {
		patchModalIfNeeded();
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});

	if (window.Liferay && typeof window.Liferay.on === 'function') {
		window.Liferay.on('endNavigate', function () {
			waitingForWorkflowModal = false;
			waitingExpiredAt = 0;
		});
	}
})();
