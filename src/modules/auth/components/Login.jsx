import React, { useState, useEffect } from 'react';
import AuthService from '../AuthService';
import LoginForm from './LoginForm';
import { 
  LoginContainer, 
  LoginBox, 
  LeftSection, 
  RightSection,
  BackgroundImage,
  Logo,
  LoginHeader,
  CompanyName,
  LoginTitle,
  LoginSubtitle
} from '../style';

// Import images
import loginBg from '../../../assets/image-login.png';
import logoVec from '../../../assets/layout/logo.png';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Check if user is already authenticated on mount
   */
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      // Redirect to home if already logged in
      window.location.href = '/web/guest/home';
    }
  }, []);

  /**
   * Handle credential changes
   * @param {string} field - Field name (username or password)
   * @param {string} value - Field value
   */
  const handleCredentialsChange = (field, value) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user types
    if (error) setError('');
  };

  /**
   * Toggle password visibility
   */
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Handle remember me checkbox
   * @param {boolean} checked - Checkbox state
   */
  const handleRememberMeChange = (checked) => {
    setRememberMe(checked);
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!credentials.username || !credentials.password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    // Email validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.username)) {
      setError('Email không hợp lệ');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await AuthService.login(
        credentials.username,
        credentials.password
      );

      if (result.success) {
        // Store user data if remember me is checked
        if (rememberMe && result.user) {
          AuthService.storeUserData(result.user);
        }
        
        // Redirect on success
        window.location.href = '/web/guest/home';
      } else {
        setError(result.error || 'Đăng nhập thất bại');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginBox>
        {/* Left Section - Background Image */}
        <LeftSection>
          <BackgroundImage src={loginBg} alt="VEC Highway" />
        </LeftSection>

        {/* Right Section - Login Form */}
        <RightSection>
          <Logo src={logoVec} alt="VEC Logo" />
          
          <CompanyName>
            TỔNG CÔNG TY<br />
            ĐẦU TƯ PHÁT TRIỂN ĐƯỜNG CAO TỐC VIỆT NAM<br />
            <span>VIETNAM EXPRESSWAY CORPORATION (VEC)</span>
          </CompanyName>

          <LoginHeader>
            <LoginTitle>ĐĂNG NHẬP</LoginTitle>
            <LoginSubtitle>Trang thông tin nội bộ của VEC</LoginSubtitle>
          </LoginHeader>

          {/* Login Form Component */}
          <LoginForm
            credentials={credentials}
            showPassword={showPassword}
            rememberMe={rememberMe}
            error={error}
            loading={loading}
            onCredentialsChange={handleCredentialsChange}
            onPasswordToggle={handlePasswordToggle}
            onRememberMeChange={handleRememberMeChange}
            onSubmit={handleSubmit}
          />
        </RightSection>
      </LoginBox>
    </LoginContainer>
  );
};

export default Login;