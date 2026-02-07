import styled from "styled-components";

export const TasksHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #0090cf33;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
`;

export const TasksSectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin: 0;
`;

export const ButtonWrapper = styled.div`
  text-align: center;
`;

// Task-specific styles will be added here as needed