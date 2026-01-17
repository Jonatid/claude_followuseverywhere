// src/App.jsx
export default function App() {
  return (
    <div className="app-shell">
      <div className="card">
        <header className="card-header">
          <h1 className="card-title">Follow us everywhere</h1>
          <p className="card-subtitle">
            Stay in the loop with our latest launches, behind-the-scenes moments,
            and community highlights across every platform.
          </p>
        </header>

        <div className="button-row">
          <button className="primary-button" type="button">
            Join the newsletter
          </button>
          <button className="secondary-button" type="button">
            Download the media kit
          </button>
        </div>

        <ul className="social-list">
          <li className="social-item">
            <span className="social-label">Instagram</span>
            <span className="social-handle">@spruce.design</span>
          </li>
          <li className="social-item">
            <span className="social-label">TikTok</span>
            <span className="social-handle">@sprucestudio</span>
          </li>
          <li className="social-item">
            <span className="social-label">X / Twitter</span>
            <span className="social-handle">@sprucehq</span>
          </li>
          <li className="social-item">
            <span className="social-label">LinkedIn</span>
            <span className="social-handle">Spruce Creative Co.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
