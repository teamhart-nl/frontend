export class ThemeChanger {

    constructor() {
        document.styleSheets[0].disabled = true;
        document.styleSheets[1].disabled = false;

        document.styleSheets[2].disabled = true;
        document.styleSheets[3].disabled = false;
    }

    darkThemeSwitch() {
        const stylesheets = document.styleSheets;
        stylesheets[0].disabled = !stylesheets[0].disabled;
        stylesheets[1].disabled = !stylesheets[1].disabled;

        stylesheets[2].disabled = !stylesheets[2].disabled;
        stylesheets[3].disabled = !stylesheets[3].disabled;
    }
}
