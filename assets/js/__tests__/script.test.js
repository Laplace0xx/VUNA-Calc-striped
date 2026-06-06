const calc = require("../script.js");

beforeEach(() => {
  document.body.innerHTML = `
    <input type="text" id="result" />
    <button id="theme-toggle"></button>
  `;
  document.body.className = "";
  calc.currentExpression = "";
  calc.LAST_RESULT = 0;
  localStorage.clear();
});

// ─── normalizeExpression ─────────────────────────────────

describe("normalizeExpression", () => {
  test("replaces sin( with sinDeg(", () => {
    expect(calc.normalizeExpression("sin(30)")).toBe("sinDeg(30)");
  });

  test("replaces cos( with cosDeg(", () => {
    expect(calc.normalizeExpression("cos(45)")).toBe("cosDeg(45)");
  });

  test("replaces tan( with tanDeg(", () => {
    expect(calc.normalizeExpression("tan(60)")).toBe("tanDeg(60)");
  });

  test("replaces asin( with asinDeg(", () => {
    expect(calc.normalizeExpression("asin(0.5)")).toBe("asinDeg(0.5)");
  });

  test("replaces acos( with acosDeg(", () => {
    expect(calc.normalizeExpression("acos(0.5)")).toBe("acosDeg(0.5)");
  });

  test("replaces atan( with atanDeg(", () => {
    expect(calc.normalizeExpression("atan(1)")).toBe("atanDeg(1)");
  });

  test("replaces asinh( with asinh(", () => {
    expect(calc.normalizeExpression("asinh(1)")).toBe("asinh(1)");
  });

  test("replaces sinh( with sinh(", () => {
    expect(calc.normalizeExpression("sinh(1)")).toBe("sinh(1)");
  });

  test("replaces standalone e with Math.E", () => {
    expect(calc.normalizeExpression("e")).toBe("Math.E");
  });

  test("replaces pi with Math.PI", () => {
    expect(calc.normalizeExpression("pi")).toBe("Math.PI");
  });

  test("replaces multiple trig functions", () => {
    const result = calc.normalizeExpression("sin(30)+cos(45)");
    expect(result).toBe("sinDeg(30)+cosDeg(45)");
  });

  test("does not alter expression without trig", () => {
    expect(calc.normalizeExpression("2+2")).toBe("2+2");
  });

  test("handles empty string", () => {
    expect(calc.normalizeExpression("")).toBe("");
  });
});

// ─── calculateExpression ─────────────────────────────────

describe("calculateExpression", () => {
  test("adds two numbers", () => {
    expect(calc.calculateExpression("2+3")).toBe(5);
  });

  test("subtracts numbers", () => {
    expect(calc.calculateExpression("10-4")).toBe(6);
  });

  test("multiplies numbers", () => {
    expect(calc.calculateExpression("3*4")).toBe(12);
  });

  test("divides numbers", () => {
    expect(calc.calculateExpression("10/2")).toBe(5);
  });

  test("handles decimal numbers", () => {
    expect(calc.calculateExpression("3.5+2.1")).toBeCloseTo(5.6);
  });

  test("handles Math.E constant", () => {
    expect(calc.calculateExpression("e")).toBe(Math.E);
  });

  test("handles Math.PI constant", () => {
    expect(calc.calculateExpression("pi")).toBe(Math.PI);
  });

  test("replaces ans with LAST_RESULT", () => {
    calc.LAST_RESULT = 42;
    expect(calc.calculateExpression("ans+1")).toBe(43);
  });

  test("replaces ANS case-insensitively", () => {
    calc.LAST_RESULT = 10;
    expect(calc.calculateExpression("ANS*2")).toBe(20);
  });

  test("returns Error for invalid expression", () => {
    expect(calc.calculateExpression("invalid")).toBe("Error");
  });

  test("returns Error for division by zero", () => {
    expect(calc.calculateExpression("1/0")).toBe("Error");
  });
});

// ─── appendToResult ──────────────────────────────────────

describe("appendToResult", () => {
  test("appends a number to empty expression", () => {
    calc.appendToResult(5);
    expect(calc.currentExpression).toBe("5");
  });

  test("appends multiple digits", () => {
    calc.appendToResult(1);
    calc.appendToResult(2);
    calc.appendToResult(3);
    expect(calc.currentExpression).toBe("123");
  });

  test("appends string value", () => {
    calc.appendToResult(".");
    expect(calc.currentExpression).toBe(".");
  });

  test("updates the display element", () => {
    calc.appendToResult(7);
    expect(document.getElementById("result").value).toBe("7");
  });
});

// ─── bracketToResult ─────────────────────────────────────

describe("bracketToResult", () => {
  test("appends opening bracket", () => {
    calc.bracketToResult("(");
    expect(calc.currentExpression).toBe("(");
  });

  test("appends closing bracket", () => {
    calc.appendToResult(2);
    calc.bracketToResult(")");
    expect(calc.currentExpression).toBe("2)");
  });
});

// ─── backspace ───────────────────────────────────────────

describe("backspace", () => {
  test("removes last character", () => {
    calc.appendToResult(123);
    calc.backspace();
    expect(calc.currentExpression).toBe("12");
  });

  test("handles empty expression", () => {
    calc.backspace();
    expect(calc.currentExpression).toBe("");
  });

  test("removes until empty", () => {
    calc.appendToResult(1);
    calc.backspace();
    expect(calc.currentExpression).toBe("");
  });
});

// ─── operatorToResult ────────────────────────────────────

describe("operatorToResult", () => {
  test("appends + operator", () => {
    calc.operatorToResult("+");
    expect(calc.currentExpression).toBe("+");
  });

  test("converts ^ to **", () => {
    calc.operatorToResult("^");
    expect(calc.currentExpression).toBe("**");
  });

  test("appends * as is", () => {
    calc.operatorToResult("*");
    expect(calc.currentExpression).toBe("*");
  });

  test("appends - operator", () => {
    calc.operatorToResult("-");
    expect(calc.currentExpression).toBe("-");
  });
});

// ─── clearResult ─────────────────────────────────────────

describe("clearResult", () => {
  test("clears the expression", () => {
    calc.appendToResult(42);
    calc.clearResult();
    expect(calc.currentExpression).toBe("");
  });

  test("shows 0 in display after clear", () => {
    calc.appendToResult(5);
    calc.clearResult();
    expect(document.getElementById("result").value).toBe("0");
  });
});

// ─── percentToResult ─────────────────────────────────────

describe("percentToResult", () => {
  test("returns early when expression is empty", () => {
    calc.percentToResult();
    expect(calc.currentExpression).toBe("");
  });

  test("converts plain number to percentage", () => {
    calc.appendToResult(50);
    calc.percentToResult();
    expect(calc.currentExpression).toBe("0.5*");
  });

  test("converts 100 to 1", () => {
    calc.appendToResult(100);
    calc.percentToResult();
    expect(calc.currentExpression).toBe("1*");
  });

  test("handles expression with operator (e.g., 200*10%)", () => {
    calc.appendToResult(200);
    calc.operatorToResult("*");
    calc.appendToResult(10);
    calc.percentToResult();
    expect(calc.currentExpression).toBe("20*");
  });

  test("returns early with NaN after operator", () => {
    calc.currentExpression = "abc+";
    calc.percentToResult();
    expect(calc.currentExpression).toBe("abc+");
  });
});

// ─── calculateResult ─────────────────────────────────────

describe("calculateResult", () => {
  test("returns early when expression is empty", () => {
    calc.calculateResult();
    expect(calc.currentExpression).toBe("");
  });

  test("calculates and stores result", () => {
    calc.appendToResult("2+3");
    calc.calculateResult();
    expect(calc.LAST_RESULT).toBe("5");
    expect(calc.currentExpression).toBe("5");
  });

  test("updates display with result", () => {
    calc.appendToResult("4*5");
    calc.calculateResult();
    expect(document.getElementById("result").value).toBe("20");
  });
});

// ─── updateResult ────────────────────────────────────────

describe("updateResult", () => {
  test("shows 0 when expression is empty", () => {
    calc.updateResult();
    expect(document.getElementById("result").value).toBe("0");
  });

  test("shows current expression in display", () => {
    calc.currentExpression = "42";
    calc.updateResult();
    expect(document.getElementById("result").value).toBe("42");
  });
});

// ─── toggleTheme ─────────────────────────────────────────

describe("toggleTheme", () => {
  test("toggles dark-mode class on body", () => {
    calc.toggleTheme();
    expect(document.body.classList.contains("dark-mode")).toBe(true);
  });

  test("saves dark theme to localStorage", () => {
    calc.toggleTheme();
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  test("toggles back to light mode", () => {
    calc.toggleTheme();
    calc.toggleTheme();
    expect(document.body.classList.contains("dark-mode")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  test("saves light theme to localStorage", () => {
    calc.toggleTheme();
    calc.toggleTheme();
    expect(localStorage.getItem("theme")).toBe("light");
  });
});

// ─── DOMContentLoaded listener ─────────────────────────

describe("DOMContentLoaded listener", () => {
  test("applies dark mode from localStorage", () => {
    localStorage.setItem("theme", "dark");
    document.body.className = "";
    window.dispatchEvent(new Event("DOMContentLoaded"));
    expect(document.body.classList.contains("dark-mode")).toBe(true);
  });

  test("applies light mode when localStorage is light", () => {
    localStorage.setItem("theme", "light");
    window.dispatchEvent(new Event("DOMContentLoaded"));
    expect(document.body.classList.contains("dark-mode")).toBe(false);
  });

  test("handles missing theme-toggle button gracefully", () => {
    document.getElementById("theme-toggle").remove();
    localStorage.setItem("theme", "dark");
    document.body.className = "";
    expect(() => {
      window.dispatchEvent(new Event("DOMContentLoaded"));
    }).not.toThrow();
  });
});

// ─── percentToResult edge cases ────────────────────────

describe("percentToResult edge cases", () => {
  test("handles eval failure in leftPart (e.g., 10a+10)", () => {
    calc.currentExpression = "10a+10";
    calc.percentToResult();
    expect(calc.currentExpression).toBe("1*");
  });

  test("returns early when plain number is NaN", () => {
    calc.currentExpression = "abc";
    calc.percentToResult();
    expect(calc.currentExpression).toBe("abc");
  });

  test("returns early when operator match has NaN left value", () => {
    calc.currentExpression = "abc+10";
    calc.percentToResult();
    expect(calc.currentExpression).toBe("abc+10");
  });
});
