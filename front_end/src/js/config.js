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
