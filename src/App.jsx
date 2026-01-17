import React, { useState } from 'react';

// ============================================
// MOCK DATA - Multiple Businesses
// ============================================
const mockBusinesses = [
  {
    id: 1,
    name: "CoffeeSpot Detroit",
    slug: "coffeespot",
    tagline: "Detroit's Best Coffee",
    logo: "CD",
    email: "hello@coffeespot.com",
    socials: [
      { platform: "Instagram", url: "https://instagram.com/coffeespot", icon: "📷" },
      { platform: "TikTok", url: "https://tiktok.com/@coffeespot", icon: "🎵" },
      { platform: "YouTube", url: "https://youtube.com/@coffeespot", icon: "▶️" },
      { platform: "Facebook", url: "https://facebook.com/coffeespot", icon: "👍" },
      { platform: "X", url: "https://x.com/coffeespot", icon: "✖️" },
      { platform: "LinkedIn", url: "https://linkedin.com/company/coffeespot", icon: "💼" },
      { platform: "Website", url: "https://coffeespot.com", icon: "🌐" }
    ]
  },
  {
    id: 2,
    name: "Barber Studio NYC",
    slug: "barberstudio",
    tagline: "Classic Cuts, Modern Style",
    logo: "BS",
    email: "info@barberstudio.com",
    socials: [
      { platform: "Instagram", url: "https://instagram.com/barberstudio", icon: "📷" },
      { platform: "TikTok", url: "https://tiktok.com/@barberstudio", icon: "🎵" },
      { platform: "Facebook", url: "https://facebook.com/barberstudio", icon: "👍" },
      { platform: "Website", url: "https://barberstudio.com", icon: "🌐" }
    ]
  }
];

// ============================================
// LANDING PAGE
// ============================================
const LandingPage = ({ onNavigate }) => {
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
              {mockBusinesses.map(business => (
                <button
                  key={business.id}
                  onClick={() => onNavigate('public', business.id)}
                  className="button button--soft button--sample"
                >
                  <span>{business.name}</span>
                  <span className="button-arrow">→</span>
                </button>
              ))}
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

  const handleSubmit = () => {
    if (!formData.businessName || !formData.email || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }

    const newBusiness = {
      id: Date.now(),
      name: formData.businessName,
      slug: formData.slug,
      tagline: formData.tagline,
      logo: formData.businessName.substring(0, 2).toUpperCase(),
      email: formData.email,
      socials: [
        { platform: "Instagram", url: "", icon: "📷" },
        { platform: "TikTok", url: "", icon: "🎵" },
        { platform: "YouTube", url: "", icon: "▶️" },
        { platform: "Facebook", url: "", icon: "👍" },
        { platform: "X", url: "", icon: "✖️" },
        { platform: "LinkedIn", url: "", icon: "💼" },
        { platform: "Website", url: "", icon: "🌐" }
      ]
    };

    onSignup(newBusiness);
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
const BusinessLogin = ({ onNavigate, businesses, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    const business = businesses.find(b => b.email === email);

    if (business) {
      onLogin(business);
    } else {
      alert('Business not found. Try hello@coffeespot.com for demo.');
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

        <div className="note-card">
          <p className="note-title">Demo credentials:</p>
          <p className="note-text">hello@coffeespot.com</p>
          <p className="note-text">info@barberstudio.com</p>
        </div>

        <p className="helper-text">
          Don't have an account?{' '}
          <button onClick={() => onNavigate('signup')} className="text-link">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

// ============================================
// BUSINESS DASHBOARD
// ============================================
const BusinessDashboard = ({ business, onNavigate, onUpdateBusiness }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempUrl, setTempUrl] = useState('');

  const handleCopyLink = () => {
    alert('Link copied to clipboard!');
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setTempUrl(business.socials[index].url);
  };

  const handleSave = (index) => {
    const updatedSocials = [...business.socials];
    updatedSocials[index] = { ...updatedSocials[index], url: tempUrl };
    onUpdateBusiness({ ...business, socials: updatedSocials });
    setEditingIndex(null);
    alert('Link updated!');
  };

  const handleLogout = () => {
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
            onClick={() => onNavigate('public', business.id)}
            className="button button--blue"
          >
            Preview Public Follow Page
          </button>

          <h2 className="heading-md heading-md--spaced">Your Social Profiles</h2>

          <div className="stack stack--small">
            {business.socials.map((social, index) => (
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

  const activeSocials = business.socials.filter(s => s.url);

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
              {business.socials.map((social, index) =>
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
                onClick={() => onNavigate('progress', business.id)}
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
  const activeSocials = business.socials.filter(s => s.url);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onNavigate('success', business.id);
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
          onClick={() => onNavigate('public', business.id)}
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
  const [businesses, setBusinesses] = useState(mockBusinesses);
  const [currentBusinessId, setCurrentBusinessId] = useState(null);

  const handleNavigate = (screen, businessId = null) => {
    setCurrentScreen(screen);
    if (businessId !== null) {
      setCurrentBusinessId(businessId);
    }
  };

  const handleSignup = (newBusiness) => {
    setBusinesses(prev => [...prev, newBusiness]);
    setCurrentBusinessId(newBusiness.id);
    setCurrentScreen('dashboard');
    alert('Account created successfully! Add your social links to get started.');
  };

  const handleLogin = (business) => {
    setCurrentBusinessId(business.id);
    setCurrentScreen('dashboard');
  };

  const handleUpdateBusiness = (updatedBusiness) => {
    setBusinesses(prev =>
      prev.map(b => b.id === updatedBusiness.id ? updatedBusiness : b)
    );
  };

  const currentBusiness = businesses.find(b => b.id === currentBusinessId);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'signup':
        return <BusinessSignup onNavigate={handleNavigate} onSignup={handleSignup} />;
      case 'login':
        return <BusinessLogin onNavigate={handleNavigate} businesses={businesses} onLogin={handleLogin} />;
      case 'dashboard':
        return currentBusiness ? (
          <BusinessDashboard
            business={currentBusiness}
            onNavigate={handleNavigate}
            onUpdateBusiness={handleUpdateBusiness}
          />
        ) : <LandingPage onNavigate={handleNavigate} />;
      case 'public':
        return currentBusiness ? (
          <PublicFollowPage business={currentBusiness} onNavigate={handleNavigate} />
        ) : <LandingPage onNavigate={handleNavigate} />;
      case 'progress':
        return currentBusiness ? (
          <FollowProgressPage business={currentBusiness} onNavigate={handleNavigate} />
        ) : <LandingPage onNavigate={handleNavigate} />;
      case 'success':
        return currentBusiness ? (
          <FollowSuccessPage business={currentBusiness} onNavigate={handleNavigate} />
        ) : <LandingPage onNavigate={handleNavigate} />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return <div>{renderScreen()}</div>;
}
