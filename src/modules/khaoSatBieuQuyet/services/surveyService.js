import surveyApi from "../apiService";
import { SURVEY_STATUS } from "../components/constants";

function getCurrentUserId() {
  if (typeof window !== "undefined" && window.location?.origin === "http://localhost:3000") {
    return 1;
  }

  if (typeof window === "undefined" || !window.Liferay?.ThemeDisplay) {
    return null;
  }

  return Number(window.Liferay.ThemeDisplay.getUserId());
}

function parseSurveyDateTime(value) {
  if (!value) {
    return null;
  }

  const matched = String(value).match(
    /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?/
  );

  if (!matched) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const [, year, month, day, hour, minute, second = "0"] = matched;

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second)
  );
}

function getFallbackVoteUnavailableReason(survey) {
  if (String(survey.status || "").toUpperCase() !== "ACTIVE") {
    return "Cuộc bình chọn không còn hoạt động.";
  }

  const now = Date.now();
  const startDate = parseSurveyDateTime(survey.startDate);
  const endDate = parseSurveyDateTime(survey.endDate);

  if (startDate && now < startDate.getTime()) {
    return "Cuộc bình chọn chưa bắt đầu.";
  }

  if (endDate && now > endDate.getTime()) {
    return "Cuộc bình chọn đã kết thúc.";
  }

  return "";
}

function normalizeStatus(survey) {
  return getFallbackVoteUnavailableReason(survey) ? SURVEY_STATUS.CLOSED : SURVEY_STATUS.OPEN;
}

function normalizeOption(option) {
  return {
    id: option.optionId,
    name: option.optionText,
    votes: Number(option.voteCount || 0)
  };
}

function normalizeSurvey(survey) {
  const options = (survey.options || []).map(normalizeOption);
  const currentUserId = getCurrentUserId();
  const voteUnavailableReason =
    survey.voteUnavailableReason || getFallbackVoteUnavailableReason(survey);
  const status = typeof survey.votingOpen === "boolean"
    ? (survey.votingOpen && !voteUnavailableReason ? SURVEY_STATUS.OPEN : SURVEY_STATUS.CLOSED)
    : normalizeStatus(survey);

  return {
    ...survey,
    id: survey.surveyId,
    title: survey.title || "",
    status,
    options,
    totalVotes: options.reduce((sum, option) => sum + option.votes, 0),
    createdAt: survey.createDate,
    allowMultiple: Boolean(survey.multipleChoice),
    hasVoted: Boolean(survey.hasVoted),
    canParticipate: Boolean(survey.canParticipate),
    isOwner: currentUserId ? Number(survey.userId) === currentUserId : false,
    voteUnavailableReason,
    voteDisabledText: voteUnavailableReason.includes("chưa bắt đầu") ? "Chưa bắt đầu" : "Đã kết thúc",
    votedOptions: survey.votedOptions || []
  };
}

function normalizeOrganization(item) {
  return {
    ...item,
    value: item.organizationId,
    label: item.name
  };
}

function normalizeUser(item) {
  return {
    ...item,
    value: item.userId,
    label: item.fullName || item.screenName || item.emailAddress
  };
}

function formatDateTime(date, time) {
  if (!date) {
    return "";
  }

  const datePart = date.format ? date.format("YYYY-MM-DD") : String(date).slice(0, 10);
  const timePart = time?.format ? time.format("HH:mm:ss") : "00:00:00";

  return `${datePart} ${timePart}`;
}

function toSurveyPayload(formData) {
  const participants = formData.participants || {};
  const deadline = formData.deadline;
  const unit = participants.unit;
  const department = participants.department;
  const members = participants.members || [];

  return {
    title: formData.title,
    description: formData.description || "",
    multipleChoice: Boolean(formData.allowMultiple),
    status: "ACTIVE",
    startDate: deadline ? formatDateTime(deadline.startDate, deadline.startTime) : "",
    endDate: deadline ? formatDateTime(deadline.endDate, deadline.endTime) : "",
    allParticipants: Boolean(participants.selectAll),
    organizationIds: !participants.selectAll && unit ? [unit] : [],
    departmentIds: !participants.selectAll && department ? [department] : [],
    userIds: !participants.selectAll ? members : [],
    options: (formData.options || []).filter((option) => option.trim() !== "")
  };
}

export async function getSurveys({
  filter,
  sort = "newest",
  page = 1,
  pageSize = 12,
  search = "",
  status = ""
} = {}) {
  const state = sort === "active" || sort === "expired" ? sort : "all";
  const orderBy = sort === "oldest" ? "asc" : "desc";
  const data = await surveyApi.getSurveys({
    page,
    pageSize,
    search,
    status,
    filter,
    state,
    orderBy
  });
  let items = (data.items || []).map(normalizeSurvey);

  return {
    ...data,
    items,
    total: data.total ?? items.length
  };
}

export async function getSurveyById(id) {
  const data = await surveyApi.getSurvey(id);
  return normalizeSurvey(data);
}

export async function createSurvey(surveyData) {
  return surveyApi.createSurvey(toSurveyPayload(surveyData));
}

export async function updateSurvey(surveyId, surveyData) {
  return surveyApi.updateSurvey(surveyId, toSurveyPayload(surveyData));
}

export async function deleteSurvey(surveyId) {
  return surveyApi.deleteSurvey(surveyId);
}

export async function submitVote(surveyId, selectedOptionIds) {
  return surveyApi.vote(surveyId, selectedOptionIds);
}

export async function getOrganizations(params = {}) {
  const data = await surveyApi.getOrganizations(params);
  return (data.items || []).map(normalizeOrganization);
}

export async function getUsers(params = {}) {
  const data = await surveyApi.getUsers(params);
  return (data.items || []).map(normalizeUser);
}
