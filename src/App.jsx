import React, { useEffect, useState } from 'react';
import {
  getBusinessBySlug,
  getMe,
  login,
  requestPasswordReset,
  resetPassword,
  signup,
  updateSocials,
} from './services/api';

// ============================================
// LANDING PAGE
// ============================================
const LandingPage = ({ onNavigate, sampleBusinesses }) => {
  return (
    <div className="screen screen--purple-blue">
      <div className="card card--wide">
        <div className="landing-header">
          <h1 className="landing-title">Follow Us Everywhere</h1>
          <p className="landing-subtitle">
            One link to connect customers to all your social pages.
          </p>
          <p className="landing-description">
            Get your custom link and QR code in minutes.
          </p>
        </div>

        <div className="stack">
          <button
            onClick={() => onNavigate('signup')}
            className="button button--primary button--large"
          >
            Create Your Follow Hub
          </button>

          <button
            onClick={() => onNavigate('login')}
            className="button button--secondary button--large"
          >
            Business Login
          </button>

          <div className="section-divider">
            <p className="section-title">View sample business pages:</p>
            <div className="stack stack--small">
              {sampleBusinesses.length > 0 ? (
                sampleBusinesses.map((business) => (
                  <button
                    key={business.slug}
                    onClick={() => onNavigate('public', business.slug)}
                    className="button button--soft button--sample"
                  >
                    <span>{business.name}</span>
                    <span className="button-arrow">→</span>
                  </button>
                ))
              ) : (
                <p className="text-muted">Sample pages will appear here once available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// BUSINESS SIGNUP
// ============================================
const BusinessSignup = ({ onNavigate, onSignup }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    slug: '',
    tagline: '',
    email: '',
    password: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Auto-generate slug from business name
      ...(field === 'businessName' && { slug: value.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '') })
    }));
  };

  const handleSubmit = async () => {
    if (!formData.businessName || !formData.email || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await signup({
        name: formData.businessName,
        slug: formData.slug,
        tagline: formData.tagline,
        email: formData.email,
        password: formData.password,
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      const meResponse = await getMe();
      onSignup({ token, business: meResponse.data });
      alert('Account created successfully! Add your social links to get started.');
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed. Please try again.';
      alert(message);
    }
  };

  return (
    <div className="screen screen--purple-blue">
      <div className="card card--medium">
        <button
          onClick={() => onNavigate('landing')}
          className="text-link text-link--muted"
        >
          ← Back
        </button>

        <div className="card-header">
          <h1 className="heading-lg">Create Your Follow Hub</h1>
          <p className="text-muted">Get started in under 2 minutes</p>
        </div>

        <div className="stack">
          <div className="form-field">
            <label className="form-label">
              Business Name *
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => handleChange('businessName', e.target.value)}
              className="form-input"
              placeholder="e.g., Joe's Coffee Shop"
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              Your Custom Link
            </label>
            <div className="slug-row">
              <span className="slug-prefix">followuseverywhere.app/</span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="form-input slug-input"
                placeholder="yourname"
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">
              Tagline (Optional)
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="form-input"
              placeholder="e.g., Best Coffee in Town"
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="form-input"
              placeholder="you@business.com"
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="form-input"
              placeholder="Create a password"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="button button--primary"
          >
            Create Account & Continue
          </button>
        </div>

        <p className="helper-text">
          Already have an account?{' '}
          <button onClick={() => onNavigate('login')} className="text-link">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

// ============================================
// BUSINESS LOGIN
// ============================================
const BusinessLogin = ({ onNavigate, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await login({ email, password });
      const { token, business } = response.data;
      localStorage.setItem('token', token);
      onLogin({ token, business });
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      alert(message);
    }
  };

  return (
    <div className="screen screen--purple-blue">
      <div className="card card--medium">
        <button
          onClick={() => onNavigate('landing')}
          className="text-link text-link--muted"
        >
          ← Back
        </button>

        <div className="card-header">
          <h1 className="heading-lg">Business Login</h1>
          <p className="text-muted">Access your dashboard</p>
        </div>

        <div className="stack">
          <div className="form-field">
            <label className="form-label">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="you@business.com"
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter your password"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="button button--primary"
          >
            Login
          </button>
        </div>

        <p className="helper-text">
          Don't have an account?{' '}
          <button onClick={() => onNavigate('signup')} className="text-link">
            Sign up
          </button>
        </p>

        <p className="helper-text">
          Forgot your password?{' '}
          <button onClick={() => onNavigate('forgot-password')} className="text-link">
            Reset it
          </button>
        </p>
      </div>
    </div>
  );
};

// ============================================
// BUSINESS DASHBOARD
// ============================================
const BusinessDashboard = ({ business, onNavigate, onUpdateBusiness, onLogout }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempUrl, setTempUrl] = useState('');
  const socials = business.socials || [];

  const handleCopyLink = async () => {
    const link = `https://followuseverywhere.app/${business.slug}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = link;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Clipboard copy failed', error);
      alert('Unable to copy link. Please copy it manually.');
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setTempUrl(socials[index].url);
  };

  const handleSave = async (index) => {
    const updatedSocials = [...socials];
    updatedSocials[index] = { ...updatedSocials[index], url: tempUrl };
    try {
      const response = await updateSocials(
        updatedSocials.map((social, display_order) => ({
          ...social,
          display_order,
        }))
      );
      onUpdateBusiness({ ...business, socials: response.data });
      setEditingIndex(null);
      alert('Link updated!');
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to update social link.';
      alert(message);
    }
  };

  const handleLogout = () => {
    onLogout();
    onNavigate('landing');
  };

  return (
    <div className="dashboard-shell">
      <div className="dashboard-container">
        <div className="dashboard-card">
          <div className="dashboard-header">
            <h1 className="heading-xl">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="text-link text-link--muted"
            >
              Logout
            </button>
          </div>

          <div className="dashboard-summary">
            <h2 className="heading-md">{business.name}</h2>
            <p className="text-muted">{business.tagline}</p>
          </div>

          <div className="link-panel">
            <p className="text-muted">Your Follow Us Everywhere link:</p>
            <div className="link-row">
              <code className="link-code">
                https://followuseverywhere.app/{business.slug}
              </code>
              <button
                onClick={handleCopyLink}
                className="button button--primary button--compact"
              >
                Copy Link
              </button>
            </div>
          </div>

          <button
            onClick={() => onNavigate('public', business.slug)}
            className="button button--blue"
          >
            Preview Public Follow Page
          </button>

          <h2 className="heading-md heading-md--spaced">Your Social Profiles</h2>

          <div className="stack stack--small">
            {socials.map((social, index) => (
              <div key={index} className="social-card">
                <div className="social-card__header">
                  <div className="social-card__platform">
                    <span className="social-icon">{social.icon}</span>
                    <span className="social-name">{social.platform}</span>
                  </div>
                  <div className="social-card__actions">
                    {editingIndex === index ? (
                      <>
                        <button
                          onClick={() => handleSave(index)}
                          className="text-link text-link--success"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingIndex(null)}
                          className="text-link text-link--muted"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit(index)}
                        className="text-link text-link--accent"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                {editingIndex === index ? (
                  <input
                    type="text"
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    className="form-input form-input--compact"
                    placeholder={`https://${social.platform.toLowerCase()}.com/yourhandle`}
                  />
                ) : (
                  <p className="social-link">
                    {social.url || `Add your ${social.platform} link`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// PASSWORD RESET REQUEST
// ============================================
const PasswordResetRequest = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      alert('Please enter your email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      await requestPasswordReset({ email });
      alert(
        'If that email exists, a reset link has been sent. Check your spam folder or wait a few minutes before trying again.'
      );
      onNavigate('login');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Unable to request a password reset right now.';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="screen screen--purple-blue">
      <div className="card card--medium">
        <button
          onClick={() => onNavigate('login')}
          className="text-link text-link--muted"
        >
          ← Back
        </button>

        <div className="card-header">
          <h1 className="heading-lg">Reset your password</h1>
          <p className="text-muted">We’ll email you a reset link.</p>
          <p className="text-muted">
            Not seeing the email? Check spam or wait a few minutes before
            requesting another link.
          </p>
        </div>

        <div className="stack">
          <div className="form-field">
            <label className="form-label">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="you@business.com"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="button button--primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// PASSWORD RESET FORM
// ============================================
const PasswordResetForm = ({ onNavigate, token: initialToken }) => {
  const [token, setToken] = useState(initialToken || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!token) {
      alert('Please enter the reset token.');
      return;
    }
    if (!newPassword) {
      alert('Please enter a new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      await resetPassword({ token, newPassword });
      alert('Password updated successfully. Please log in.');
      onNavigate('login');
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to reset password.';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="screen screen--purple-blue">
      <div className="card card--medium">
        <button
          onClick={() => onNavigate('login')}
          className="text-link text-link--muted"
        >
          ← Back to login
        </button>

        <div className="card-header">
          <h1 className="heading-lg">Choose a new password</h1>
          <p className="text-muted">Use the token from your email.</p>
        </div>

        <div className="stack">
          <div className="form-field">
            <label className="form-label">
              Reset Token
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="form-input"
              placeholder="Paste your reset token"
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-input"
              placeholder="Create a new password"
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              placeholder="Re-enter new password"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="button button--primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// PUBLIC FOLLOW PAGE
// ============================================
const PublicFollowPage = ({ business, onNavigate }) => {
  const handlePlatformClick = (platform, url) => {
    if (!url) {
      alert(`${platform} link not configured yet`);
      return;
    }
    console.log(`User clicked ${platform}`);
    window.open(url, '_blank');
  };

  const socials = business.socials || [];
  const activeSocials = socials.filter(s => s.url);

  return (
    <div className="screen screen--blue-purple">
      <div className="card card--medium">
        <button
          onClick={() => onNavigate('landing')}
          className="text-link text-link--muted"
        >
          ← Back
        </button>

        <div className="card-header">
          <div className="logo-circle">
            {business.logo}
          </div>
          <h1 className="heading-lg">{business.name}</h1>
          <p className="text-muted">{business.tagline}</p>
          <p className="helper-text">Follow this business everywhere in two taps.</p>
        </div>

        {activeSocials.length === 0 ? (
          <div className="empty-state">
            <p>This business hasn't added their social links yet.</p>
          </div>
        ) : (
          <>
            <div className="stack stack--small">
              {socials.map((social, index) =>
                social.url ? (
                  <button
                    key={index}
                    onClick={() => handlePlatformClick(social.platform, social.url)}
                    className="button button--ghost"
                  >
                    <span className="button__content">
                      <span className="social-icon">{social.icon}</span>
                      <span>
                        {social.platform === 'YouTube' ? 'Subscribe on' :
                         social.platform === 'Facebook' ? 'Like on' :
                         social.platform === 'LinkedIn' ? 'Connect on' :
                         social.platform === 'Website' ? 'Visit' :
                         'Follow on'} {social.platform}
                      </span>
                    </span>
                    <span className="button-arrow muted-arrow">→</span>
                  </button>
                ) : null
              )}
            </div>

            {activeSocials.length > 1 && (
              <button
                onClick={() => onNavigate('progress')}
                className="button button--gradient button--large"
              >
                Follow Us Everywhere
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ============================================
// FOLLOW PROGRESS PAGE
// ============================================
const FollowProgressPage = ({ business, onNavigate }) => {
  const [progress, setProgress] = useState(0);
  const activeSocials = (business.socials || []).filter(s => s.url);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onNavigate('success');
    }, 2500);

    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 1, activeSocials.length));
    }, 350);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onNavigate, activeSocials.length, business.id]);

  return (
    <div className="screen screen--purple-blue">
      <div className="card card--medium">
        <div className="card-header">
          <div className="spinner"></div>
          <h1 className="heading-md">
            Connecting you to {business.name}...
          </h1>
          <p className="text-muted">
            We're opening your apps so you can follow and subscribe.
          </p>
        </div>

        <div className="stack stack--small">
          {activeSocials.map((social, index) => (
            <div
              key={index}
              className={`progress-item ${index < progress ? 'progress-item--active' : ''}`}
            >
              <span className="social-icon">{social.icon}</span>
              <div className="progress-item__details">
                <p className="progress-item__title">{social.platform}</p>
                <p className="progress-item__status">
                  {index < progress ? 'Opened!' : 'Opening profile...'}
                </p>
              </div>
              {index < progress && <span className="progress-check">✓</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// FOLLOW SUCCESS PAGE
// ============================================
const FollowSuccessPage = ({ business, onNavigate }) => {
  return (
    <div className="screen screen--green-blue">
      <div className="card card--medium card--center">
        <div className="success-icon">
          ✓
        </div>

        <h1 className="heading-lg">Success!</h1>

        <p className="success-message">
          You're now connected to <span className="text-strong">{business.name}</span> on the platforms you chose.
        </p>

        <button
          onClick={() => onNavigate('public', business.slug)}
          className="button button--blue"
        >
          Back to Follow Page
        </button>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [currentBusiness, setCurrentBusiness] = useState(null);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('token'));
  const [publicBusiness, setPublicBusiness] = useState(null);
  const [publicSlug, setPublicSlug] = useState(null);
  const [sampleBusinesses, setSampleBusinesses] = useState([]);
  const [isAuthLoading, setIsAuthLoading] = useState(Boolean(localStorage.getItem('token')));
  const [resetToken, setResetToken] = useState('');

  useEffect(() => {
    const { pathname, search } = window.location;
    const searchParams = new URLSearchParams(search);
    const token = searchParams.get('token') || '';

    if (pathname.startsWith('/b/')) {
      const slug = pathname.replace('/b/', '').split('/')[0];
      if (slug) {
        setPublicSlug(slug);
        setCurrentScreen('public');
      }
    } else if (pathname === '/reset-password') {
      setResetToken(token);
      setCurrentScreen('reset-password');
    }
  }, []);

  useEffect(() => {
    if (!authToken) {
      setIsAuthLoading(false);
      return;
    }

    let isMounted = true;
    setIsAuthLoading(true);
    getMe()
      .then((response) => {
        if (isMounted) {
          setCurrentBusiness(response.data);
        }
      })
      .catch(() => {
        if (isMounted) {
          localStorage.removeItem('token');
          setAuthToken(null);
          setCurrentBusiness(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [authToken]);

  useEffect(() => {
    const sampleSlugs = ['coffeespot', 'barberstudio'];
    let isMounted = true;

    Promise.allSettled(sampleSlugs.map((slug) => getBusinessBySlug(slug)))
      .then((results) => {
        if (!isMounted) {
          return;
        }
        const validBusinesses = results
          .filter((result) => result.status === 'fulfilled')
          .map((result) => result.value.data);
        setSampleBusinesses(validBusinesses);
      })
      .catch(() => {
        if (isMounted) {
          setSampleBusinesses([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!publicSlug) {
      return;
    }

    let isMounted = true;
    setPublicBusiness(null);

    getBusinessBySlug(publicSlug)
      .then((response) => {
        if (isMounted) {
          setPublicBusiness(response.data);
        }
      })
      .catch(() => {
        if (isMounted) {
          if (currentBusiness && currentBusiness.slug === publicSlug) {
            setPublicBusiness(currentBusiness);
            return;
          }
          alert('Business not found.');
          setCurrentScreen('landing');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [publicSlug, currentBusiness]);

  const handleNavigate = (screen, slug = null) => {
    setCurrentScreen(screen);
    if (screen === 'public' && slug) {
      setPublicSlug(slug);
    }
  };

  const handleSignup = ({ token, business }) => {
    setAuthToken(token);
    setCurrentBusiness(business);
    setCurrentScreen('dashboard');
  };

  const handleLogin = ({ token, business }) => {
    setAuthToken(token);
    setCurrentBusiness(business);
    setCurrentScreen('dashboard');
  };

  const handleUpdateBusiness = (updatedBusiness) => {
    setCurrentBusiness(updatedBusiness);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setCurrentBusiness(null);
  };

  const activePublicBusiness = publicBusiness || currentBusiness;

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} sampleBusinesses={sampleBusinesses} />;
      case 'signup':
        return <BusinessSignup onNavigate={handleNavigate} onSignup={handleSignup} />;
      case 'login':
        return <BusinessLogin onNavigate={handleNavigate} onLogin={handleLogin} />;
      case 'forgot-password':
        return <PasswordResetRequest onNavigate={handleNavigate} />;
      case 'reset-password':
        return <PasswordResetForm onNavigate={handleNavigate} token={resetToken} />;
      case 'dashboard':
        return currentBusiness ? (
          <BusinessDashboard
            business={currentBusiness}
            onNavigate={handleNavigate}
            onUpdateBusiness={handleUpdateBusiness}
            onLogout={handleLogout}
          />
        ) : <LandingPage onNavigate={handleNavigate} sampleBusinesses={sampleBusinesses} />;
      case 'public':
        return activePublicBusiness ? (
          <PublicFollowPage business={activePublicBusiness} onNavigate={handleNavigate} />
        ) : <LandingPage onNavigate={handleNavigate} sampleBusinesses={sampleBusinesses} />;
      case 'progress':
        return activePublicBusiness ? (
          <FollowProgressPage business={activePublicBusiness} onNavigate={handleNavigate} />
        ) : <LandingPage onNavigate={handleNavigate} sampleBusinesses={sampleBusinesses} />;
      case 'success':
        return activePublicBusiness ? (
          <FollowSuccessPage business={activePublicBusiness} onNavigate={handleNavigate} />
        ) : <LandingPage onNavigate={handleNavigate} sampleBusinesses={sampleBusinesses} />;
      default:
        return <LandingPage onNavigate={handleNavigate} sampleBusinesses={sampleBusinesses} />;
    }
  };

  if (isAuthLoading) {
    return <div className="screen screen--purple-blue"></div>;
  }

  return <div>{renderScreen()}</div>;
}
