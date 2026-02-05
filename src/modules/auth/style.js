import styled, { keyframes } from 'styled-components';

// Animations
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

// Main Container
export const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0089d0 0%, #005a8d 100%);
`;

// Login Box
export const LoginBox = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: white;
  overflow: hidden;
  animation: ${slideIn} 0.5s ease-out;
  @media (max-width: 968px) {
    flex-direction: column;
  }
`;

// Left Section - Background Image
export const LeftSection = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  @media (max-width: 968px) {
    display: none;
  }
`;

export const BackgroundImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// Right Section - Form
export const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;

  @media (max-width: 968px) {
    padding: 40px 30px;
  }

  @media (max-width: 480px) {
    padding: 30px 20px;
  }
`;

// Logo
export const Logo = styled.img`
  width: 90px;
  height: auto;
  margin-bottom: 10px;
  align-self: center;
`;

// Company Name
export const CompanyName = styled.div`
  text-align: center;
  color: #e31c2a;
  font-weight: 700;
  font-size: 18px;
  line-height: 1.2;
  margin-bottom: 15px;

  span {
    color: #0090CF;
    font-size: 14px;
    font-weight: 600;
  }
`;

// Login Header
export const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

export const LoginTitle = styled.h2`
  margin: 0 0 8px 0;
  color: #1e1e1e;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 1px;
`;

export const LoginSubtitle = styled.p`
  margin: 0;
  color: #1e1e1e;
  font-size: 15px;
`;

// Form
export const LoginForm = styled.form`
  width: 365px;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
  font-size: 14px;
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  background: #f8f9fa;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #0089d0;
    background: white;
    box-shadow: 0 0 0 3px rgba(0, 137, 208, 0.1);
  }
`;

export const Icon = styled.span`
  padding: 0 15px;
  font-size: 18px;
  color: #999;
`;

export const Input = styled.input`
  flex: 1;
  padding: 14px 15px 14px 0;
  border: none;
  background: transparent;
  font-size: 15px;
  outline: none;
  color: #333;

  &::placeholder {
    color: #999;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

export const PasswordToggle = styled.button`
  padding: 0 15px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  color: #999;
  transition: color 0.3s;

  &:hover {
    color: #0089d0;
  }
`;

// Checkbox
export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
`;

export const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  margin-right: 8px;
  cursor: pointer;
  accent-color: #d32f2f;
`;

export const CheckboxLabel = styled.label`
  flex: 1;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  user-select: none;
`;

export const ForgotPasswordLink = styled.a`
  color: #0089d0;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;

  &:hover {
    color: #005a8d;
    text-decoration: underline;
  }
`;

// Error Alert
export const ErrorAlert = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  background: #fee;
  color: #c33;
  border: 1px solid #fcc;
  font-size: 14px;
  animation: ${shake} 0.3s ease-in-out;
`;

// Submit Button
export const SubmitButton = styled.button`
  width: 100%;
  padding: 14px 24px;
  border: none;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  background: #0089d0;
  color: white;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: #005a8d;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 137, 208, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

// Spinner
export const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;