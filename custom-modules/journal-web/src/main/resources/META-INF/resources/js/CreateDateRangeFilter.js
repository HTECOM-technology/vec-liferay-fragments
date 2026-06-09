/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {navigate} from 'frontend-js-web';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isValidDateString(value) {
	if (!DATE_REGEX.test(value)) {
		return false;
	}

	const date = new Date(`${value}T00:00:00Z`);

	return (
		!Number.isNaN(date.getTime()) &&
		date.toISOString().slice(0, 10) === value
	);
}

export default function CreateDateRangeFilter({formId, portletNamespace}) {
	const form = document.getElementById(formId);

	if (!form) {
		return;
	}

	const applyButton = form.querySelector('[data-apply-date-range]');
	const clearButton = form.querySelector('[data-clear-date-range]');
	const endDateInput = form.querySelector('[data-end-date]');
	const startDateInput = form.querySelector('[data-start-date]');

	if (!applyButton || !clearButton || !endDateInput || !startDateInput) {
		return;
	}

	const clearValidity = () => {
		endDateInput.setCustomValidity('');
		startDateInput.setCustomValidity('');
	};

	const getParameterName = (name) => `${portletNamespace}${name}`;

	const resetPagination = (url) => {
		url.searchParams.delete(getParameterName('articlesCur'));
		url.searchParams.delete(getParameterName('cur'));
		url.searchParams.set(getParameterName('resetCur'), 'true');
	};

	const validate = () => {
		clearValidity();

		const endDate = endDateInput.value;
		const startDate = startDateInput.value;

		if (!startDate || !endDate) {
			startDateInput.setCustomValidity(
				Liferay.Language.get('please-fill-out-this-field')
			);
			startDateInput.reportValidity();

			return false;
		}

		if (!isValidDateString(startDate)) {
			startDateInput.setCustomValidity(
				Liferay.Language.get('please-enter-a-valid-date')
			);
			startDateInput.reportValidity();

			return false;
		}

		if (!isValidDateString(endDate)) {
			endDateInput.setCustomValidity(
				Liferay.Language.get('please-enter-a-valid-date')
			);
			endDateInput.reportValidity();

			return false;
		}

		if (startDate > endDate) {
			endDateInput.setCustomValidity(
				Liferay.Language.get(
					'end-date-must-be-greater-than-or-equal-to-start-date'
				)
			);
			endDateInput.reportValidity();

			return false;
		}

		return true;
	};

	const applyDateRange = () => {
		if (!validate()) {
			return;
		}

		const url = new URL(window.location.href);

		url.searchParams.set(
			getParameterName('startDate'),
			startDateInput.value
		);
		url.searchParams.set(
			getParameterName('endDate'),
			endDateInput.value
		);
		resetPagination(url);

		navigate(url.href);
	};

	const clearDateRange = () => {
		clearValidity();

		const url = new URL(window.location.href);

		['endDate', 'startDate'].forEach((name) => {
			url.searchParams.delete(name);
			url.searchParams.delete(getParameterName(name));
		});

		resetPagination(url);

		navigate(url.href);
	};

	const onInput = () => clearValidity();

	applyButton.addEventListener('click', applyDateRange);
	clearButton.addEventListener('click', clearDateRange);
	endDateInput.addEventListener('input', onInput);
	startDateInput.addEventListener('input', onInput);

	return {
		dispose() {
			applyButton.removeEventListener('click', applyDateRange);
			clearButton.removeEventListener('click', clearDateRange);
			endDateInput.removeEventListener('input', onInput);
			startDateInput.removeEventListener('input', onInput);
		},
	};
}
