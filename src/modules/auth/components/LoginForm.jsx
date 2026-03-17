import React from 'react';
import {
  LoginForm as StyledForm,
  FormGroup,
  InputWrapper,
  Input,
  Icon,
  PasswordToggle,
  CheckboxWrapper,
  Checkbox,
  CheckboxLabel,
  ErrorAlert,
  SubmitButton,
  Spinner,
  ForgotPasswordLink
} from '../style';
import { LuUser,LuLockKeyhole, LuEye } from "react-icons/lu";


const LoginForm = ({
  credentials,
  showPassword,
  rememberMe,
  error,
  loading,
  onCredentialsChange,
  onPasswordToggle,
  onRememberMeChange,
  onSubmit
}) => {
  /**
   * Handle input changes and propagate to parent
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onCredentialsChange(name, value);
  };

  return (
    <StyledForm onSubmit={onSubmit}>
      {/* Error Alert */}
      {error && (
        <ErrorAlert role="alert">
          {error}
        </ErrorAlert>
      )}

      {/* Email/Username Input */}
      <FormGroup>
        <InputWrapper>
          <Icon aria-hidden="true"><LuUser /></Icon>
          <Input
            type="text"
            name="username"
            placeholder="Email"
            value={credentials.username}
            onChange={handleInputChange}
            autoComplete="username"
            autoFocus
            disabled={loading}
            aria-label="Email or Username"
            required
          />
        </InputWrapper>
      </FormGroup>

      {/* Password Input */}
      <FormGroup>
        <InputWrapper>
          <Icon aria-hidden="true"><LuLockKeyhole /></Icon>
          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Mật khẩu"
            value={credentials.password}
            onChange={handleInputChange}
            autoComplete="current-password"
            disabled={loading}
            aria-label="Password"
            required
          />
          <PasswordToggle
            type="button"
            onClick={onPasswordToggle}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            <LuEye />
          </PasswordToggle>
        </InputWrapper>
      </FormGroup>

      {/* Submit Button */}
      <SubmitButton type="submit" disabled={loading}>
        {loading ? (
          <>
            <Spinner />
            Đang xử lý...
          </>
        ) : (
          'Đăng nhập'
        )}
      </SubmitButton>
      
      {/* Remember Me and Forgot Password */}
      <CheckboxWrapper>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => onRememberMeChange(e.target.checked)}
            disabled={loading}
          />
          <CheckboxLabel htmlFor="rememberMe">
            Ghi nhớ đăng nhập
          </CheckboxLabel>
        </div>
        
        <ForgotPasswordLink href="/c/portal/forgot_password" target="_self">
          Quên mật khẩu?
        </ForgotPasswordLink>
      </CheckboxWrapper>

    </StyledForm>
  );
};

export default LoginForm;