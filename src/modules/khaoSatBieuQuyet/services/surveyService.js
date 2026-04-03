import apiClient from "../../../common/apiClient";

const USE_FIREBASE = process.env.REACT_APP_USE_FIREBASE === "true";

function toArray(data) {
  if (!data) {
    return [];
  }
  if (Array.isArray(data)) {
    return data;
  }
  return Object.entries(data).map(([key, value]) => ({ ...value, id: value.id ?? key }));
}

function sortItems(items, sort) {
  const copy = [...items];
  if (sort === "oldest") {
    copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else {
    copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  return copy;
}

function paginate(items, page, pageSize) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export async function getSurveys({ filter, sort = "newest", page = 1, pageSize = 12 } = {}) {
  if (USE_FIREBASE) {
    const { data } = await apiClient.get("/surveys");
    let items = toArray(data);
    items = sortItems(items, sort);
    const total = items.length;
    return { items: paginate(items, page, pageSize), total };
  }

  const { data } = await apiClient.get("/surveys", {
    params: { filter, sort, page, pageSize },
  });
  return data;
}

export async function getSurveyById(id) {
  if (USE_FIREBASE) {
    const { data } = await apiClient.get(`/surveys/${id}`);
    return data;
  }
  const { data } = await apiClient.get(`/surveys/${id}`);
  return data;
}

export async function createSurvey(surveyData) {
  const payload = {
    ...surveyData,
    status: "open",
    totalVotes: 0,
    hasVoted: false,
    createdAt: new Date().toISOString(),
    options: surveyData.options.map((name, i) => ({
      id: `opt-${Date.now()}-${i}`,
      name,
      votes: 0,
    })),
  };

  if (USE_FIREBASE) {
    const { data } = await apiClient.post("/surveys", payload);
    return data;
  }

  const { data } = await apiClient.post("/surveys", payload);
  return data;
}

export async function submitVote(surveyId, selectedOptionIds) {
  if (USE_FIREBASE) {
    const { data: survey } = await apiClient.get(`/surveys/${surveyId}`);
    if (!survey) throw new Error(`Survey ${surveyId} not found`);

    const previousVotes = survey.votedOptions ?? [];

    const updated = {
      ...survey,
      hasVoted: true,
      votedOptions: selectedOptionIds,
      options: survey.options.map((opt) => {
        let votes = opt.votes;
        if (previousVotes.includes(opt.id)) votes -= 1;
        if (selectedOptionIds.includes(opt.id)) votes += 1;
        return { ...opt, votes: Math.max(0, votes) };
      }),
    };
    updated.totalVotes = updated.options.reduce((s, o) => s + o.votes, 0);

    await apiClient.put(`/surveys/${surveyId}`, updated);
    return updated;
  }

  const { data } = await apiClient.post(`/surveys/${surveyId}/votes`, {
    optionIds: selectedOptionIds,
  });
  return data;
}
