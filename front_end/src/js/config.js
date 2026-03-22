tailwind.config = {
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        alert: {
          DEFAULT: "hsl(var(--alert))",
          foreground: "hsl(var(--alert-foreground))"
        },
        card: "hsl(var(--card))",
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        "chat-user": {
          DEFAULT: "hsl(var(--chat-user))",
          foreground: "hsl(var(--chat-user-foreground))"
        },
        "chat-bot": {
          DEFAULT: "hsl(var(--chat-bot))",
          foreground: "hsl(var(--chat-bot-foreground))"
        }
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "float": "float 3s ease-in-out infinite",
        "gradient": "gradient 8s linear infinite",
        "scale-in": "scaleIn 0.4s ease-out forwards"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" }
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" }
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        }
      }
    }
  }
}

window.SAFENET_CONFIG = window.SAFENET_CONFIG || {};
(() => {
  const stored = localStorage.getItem('safenet_api_base');
  const port = String(window.location.port || '');
  const defaultBackEnd = (port === '5500' || port === '5501' || port === '5173' || port === '3000')
    ? 'http://localhost:8080'
    : window.location.origin;
  window.SAFENET_CONFIG.apiBaseUrl = window.SAFENET_CONFIG.apiBaseUrl || stored || defaultBackEnd;
})();
window.SAFENET_CONFIG.apiPrefix = window.SAFENET_CONFIG.apiPrefix || '/api';
window.SAFENET_CONFIG.apiTimeoutMs = window.SAFENET_CONFIG.apiTimeoutMs || 12000;
window.SAFENET_CONFIG.reportsPath = window.SAFENET_CONFIG.reportsPath || '/reports';
window.SAFENET_CONFIG.surveyPath = window.SAFENET_CONFIG.surveyPath || '/survey';
window.SAFENET_CONFIG.authLoginPath = window.SAFENET_CONFIG.authLoginPath || '/auth/login';
window.SAFENET_CONFIG.authRegisterPath = window.SAFENET_CONFIG.authRegisterPath || '/auth/register';
window.SAFENET_CONFIG.authMePath = window.SAFENET_CONFIG.authMePath || '/auth/me';
window.SAFENET_CONFIG.authLogoutPath = window.SAFENET_CONFIG.authLogoutPath || '/auth/logout';
