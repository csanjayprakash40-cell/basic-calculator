# Basic Calculator

A beginner-friendly calculator made with plain HTML, CSS, and JavaScript. It has a responsive blue-and-white interface, a two-line display, mouse and keyboard controls, chained arithmetic, percentage, and floating-point rounding.

## Project files

- `index.html` — page structure and calculator buttons.
- `style.css` — layout, colors, focus indicators, and mobile styles.
- `script.js` — calculator state, arithmetic, and input handling.

## Run the calculator

1. Download or clone this project and keep all three project files in the same folder.
2. Open that folder in File Explorer.
3. Double-click `index.html` (or right-click it and choose a web browser).
4. Use the on-screen buttons or your keyboard to calculate.

No installation, server, or external library is needed.

## Keyboard controls

| Key | Action |
| --- | --- |
| `0`–`9` | Enter a digit |
| `+`, `-`, `*`, `/` | Choose an operation |
| `.` | Enter a decimal point |
| `Enter` or `=` | Calculate |
| `Backspace` | Delete the last character |
| `Escape` or `C` | Clear |
| `%` | Divide the current number by 100 |

## Publish with GitHub Pages

1. Sign in to [GitHub](https://github.com/) and create a new repository. For a public project page, a repository name such as `basic-calculator` is fine.
2. On the repository page, choose **Add file** → **Upload files**.
3. Upload `index.html`, `style.css`, `script.js`, and `README.md` from this project folder. Make sure `index.html` is at the repository root, not inside another folder.
4. Enter a commit message such as `Add basic calculator` and choose **Commit changes**.
5. Open the repository's **Settings** tab, then choose **Pages** in the sidebar.
6. Under **Build and deployment**, choose **Deploy from a branch**.
7. Select the `main` branch and the `/(root)` folder, then choose **Save**.
8. Wait for the Pages deployment to finish. The Pages settings will show the published website link; open it to check the calculator.

## How `script.js` works

The script keeps the displayed number, saved number, pending operator, and input state in variables. Button clicks and keyboard presses call the same small functions, so both ways of using the calculator behave consistently. When an operator is chosen, a pending calculation is completed first, which enables chained operations. The equals function calculates and updates both display lines. Results are rounded to 12 significant digits to hide common floating-point artifacts, and division by zero displays `Error` until a new digit or clear action is entered.

## Try these exercises

1. Add a **±** button that changes the sign of the current number.
2. Add a **square root** button and decide how the calculator should display a negative input.
3. Add a **theme toggle** that switches between the existing colors and a dark theme.